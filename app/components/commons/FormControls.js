import React from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, X } from 'lucide-react-native';
import { getMedicalModalTheme } from '../../constants/tableTheme';

export function GenderSelector({ value, onChange, theme }) {
    const options = [
        { label: 'Male', val: 'M' },
        { label: 'Female', val: 'F' },
        { label: 'Other', val: 'O' }
    ];

    return (
        <View style={{ marginBottom: 15 }}>
            <Text style={{ color: theme.textDim, marginBottom: 8, fontWeight: '600' }}>Gender</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                {options.map((opt) => {
                    const isActive = value === opt.val;
                    return (
                        <TouchableOpacity
                            key={opt.val}
                            onPress={() => onChange(opt.val)}
                            style={{
                                flex: 1,
                                backgroundColor: isActive ? theme.primary : theme.cardBg,
                                paddingVertical: 12,
                                borderRadius: 12,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: isActive ? theme.primary : theme.border
                            }}
                        >
                            <Text style={{ color: isActive ? 'white' : theme.text, fontWeight: 'bold' }}>{opt.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}


