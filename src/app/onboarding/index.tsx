import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Easing,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import { useTranslation } from "@/i18n/translation"; // if needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useAuthUser } from '@/shared/hooks/useAuthUser';
import { updateUserProfile } from '@/api/voiceagent';
import { Orb } from '../agent/components/LiveCall/Orb';
import { Topic, Persona } from '@/types';
import WelcomeStep from './components/WelcomeStep';
import NameStep from './components/NameStep';
import TopicStep from './components/TopicStep';
import PersonaStep from './components/PersonaStep';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [userName, setUserName] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
    const [isMatching, setIsMatching] = useState(false);
    
    // Auth State
    const { user, refreshUser } = useAuthUser();

    // Audio State
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [playingId, setPlayingId] = useState<string | null>(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const orbScale = useRef(new Animated.Value(1)).current;
    const bgBreath = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bgBreath, { toValue: 1, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
                Animated.timing(bgBreath, { toValue: 0, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
            ])
        ).start();

        if (currentStep === 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(orbScale, { toValue: 1.15, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                    Animated.timing(orbScale, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
                ])
            ).start();
        } else {
            orbScale.stopAnimation();
            orbScale.setValue(1);
        }
    }, [currentStep]);

    useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    const playAudioPreview = async (url: string | undefined, id: string) => {
        if (!url) return;
        try {
            if (sound) {
                await sound.unloadAsync();
            }
            const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
            setSound(newSound);
            setPlayingId(id);
            
            newSound.setOnPlaybackStatusUpdate((status) => {
                if ('didJustFinish' in status && status.didJustFinish) {
                    setPlayingId(null);
                }
            });

            await newSound.playAsync();
        } catch (e) {
            console.log("Audio preview failed", e);
            setPlayingId(null);
        }
    };

    const handleSelectPersona = (p: Persona) => {
        setSelectedPersonaId(p._id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        playAudioPreview(p.voice?.sampleUrl, p._id);
    };

    const transitionTo = (step: number) => {
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
            setCurrentStep(step);
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
        });
    };

    // Handlers
    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Keyboard.dismiss();
        
        if (sound) {
            sound.stopAsync();
            setPlayingId(null);
        }

        if (currentStep === 3) {
            setIsMatching(true);
            setTimeout(() => handleComplete(), 2000);
            return;
        }
        transitionTo(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep === 0) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (sound) {
            sound.stopAsync();
            setPlayingId(null);
        }
        transitionTo(currentStep - 1);
    };

    const handleComplete = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await AsyncStorage.setItem('onboarding_completed', 'true');
        await AsyncStorage.setItem('user_name', userName);
        await AsyncStorage.setItem('onboarding_selected_persona_id', selectedPersonaId || '');

        if (user) {
            try {
                await updateUserProfile({ nickname: userName });
                await refreshUser();
            } catch (error) {
                console.error("Failed to sync onboarding name to profile:", error);
            }
        }

        router.replace('/');
    };

    const steps = [
        () => <WelcomeStep orbScale={orbScale} onNext={handleNext} />,
        () => <NameStep userName={userName} setUserName={setUserName} onNext={handleNext} onBack={handleBack} />,
        () => <TopicStep selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} onNext={handleNext} onBack={handleBack} />,
        () => <PersonaStep 
                isMatching={isMatching} 
                orbScale={orbScale} 
                selectedPersonaId={selectedPersonaId} 
                playingId={playingId} 
                handleSelectPersona={handleSelectPersona} 
                onNext={handleNext} 
                onBack={handleBack} 
              />
    ];

    // Background color interpolation
    const bgColor = bgBreath.interpolate({
        inputRange: [0, 1],
        outputRange: ['#020210', '#0a0518']
    });

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: '#020210' }}>
            <Animated.View style={{ flex: 1, backgroundColor: bgColor }}>
                <LinearGradient colors={['#4c1d9540', 'transparent']} className="absolute inset-0 top-0 h-[400px] opacity-40 pointer-events-none" />
                
                <View className="flex-row justify-center pt-8 gap-3 z-50">
                    {steps.map((_, i) => (
                        <View key={i} className={`h-1.5 rounded-full ${i === currentStep ? 'w-10 bg-white' : i < currentStep ? 'w-4 bg-violet-400/60' : 'w-4 bg-white/10'}`} />
                    ))}
                </View>

                <Animated.View style={{ flex: 1, opacity: fadeAnim , marginTop: 20}}>
                    {steps[currentStep]()}
                </Animated.View>
            </Animated.View>
        </ScreenContainer>
    );
}
