import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getMedicalModalTheme } from '../../constants/tableTheme';
import { Calendar, Check, ChevronDown, Clock, Droplet, Mail, Phone, User, X } from 'lucide-react-native';
import { BLOOD_GROUPS } from '../../constants/medical';
import { CustomPicker, InputGroup } from './FormControls';

export default function AppointmentEditModal({ visible, theme, styles, form, setForm, onClose, onSave }) {
    const modalTheme = getMedicalModalTheme(theme);
    const [pickerType, setPickerType] = useState(null);
    const [pickerMode, setPickerMode] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());

    const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const openDatePicker = (mode, currentVal) => {
        setPickerMode(mode);
        const validDate = currentVal instanceof Date && !Number.isNaN(currentVal.getTime()) ? currentVal : new Date();
        setTempDate(validDate);
        setShowDatePicker(true);
    };

    const saveDateSelection = (dateToSave) => {
        const date = dateToSave || tempDate;
        if (pickerMode === 'date') {
            setForm((prev) => ({ ...prev, dateObj: date, date: formatDate(date) }));
        } else if (pickerMode === 'time') {
            setForm((prev) => ({ ...prev, timeObj: date, time: formatTime(date) }));
        }
        setShowDatePicker(false);
    };

    const onDateChange = (_event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setTempDate(selectedDate);
            if (Platform.OS === 'android') {
                saveDateSelection(selectedDate);
            }
        }
    };

    return (
        <>
            <CustomPicker
                visible={pickerType === 'blood'}
                title="Blood Group"
                data={BLOOD_GROUPS}
                onClose={() => setPickerType(null)}
                onSelect={(val) => setForm((prev) => ({ ...prev, blood: val }))}
                theme={theme}
                maxHeight={500}
            />
            {showDatePicker && (
                Platform.OS === 'ios' ? (
                    <Modal transparent animationType="slide" visible={showDatePicker}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15, 23, 42, 0.35)' }}>
                            <View style={{ backgroundColor: theme.cardBg, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}><Text style={{ color: theme.textDim, fontSize: 16 }}>Cancel</Text></TouchableOpacity>
                                    <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>Select {pickerMode === 'time' ? 'Time' : 'Date'}</Text>
                                    <TouchableOpacity onPress={() => saveDateSelection(tempDate)}><Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16 }}>Confirm</Text></TouchableOpacity>
                                </View>
                                <DateTimePicker testID="appointmentEditDatePicker" value={tempDate} mode={pickerMode === 'time' ? 'time' : 'date'} is24Hour={false} display="spinner" onChange={onDateChange} themeVariant={theme.mode} textColor={theme.text} />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker testID="appointmentEditDatePicker" value={tempDate} mode={pickerMode === 'time' ? 'time' : 'date'} is24Hour={false} display="default" onChange={onDateChange} themeVariant={theme.mode} />
                )
            )}
            <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
                <View style={{ flex: 1, backgroundColor: modalTheme.overlay, justifyContent: 'center', paddingHorizontal: 0, paddingVertical: 0 }}>
                    <LinearGradient colors={modalTheme.shellColors} style={{ borderRadius: 32, marginHorizontal: 12, padding: 2, maxHeight: '92%' }}>
                        <View style={{ backgroundColor: modalTheme.surface, borderRadius: 28, borderWidth: 1.5, borderColor: modalTheme.shellBorder, overflow: 'hidden', maxHeight: '100%' }}>
                            <LinearGradient colors={modalTheme.headerColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingHorizontal: 22, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: modalTheme.sectionBorder, position: 'relative' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <View style={{ flex: 1, paddingRight: 48 }}>
                                        <Text style={{ color: modalTheme.headerText, fontSize: 22, fontWeight: '900', letterSpacing: 0.5 }}>Edit Appointment</Text>
                                        <Text style={{ color: modalTheme.eyebrowText, fontSize: 13, marginTop: 4, fontWeight: '600' }}>Update the appointment details and save the changes.</Text>
                                    </View>
                                    <TouchableOpacity onPress={onClose} style={{ position: 'absolute', top: 8, right: 0, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: modalTheme.closeBg, zIndex: 10 }}>
                                        <X size={22} color={modalTheme.closeIcon} />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>

                            <ScrollView contentContainerStyle={{ padding: 22, gap: 18 }} showsVerticalScrollIndicator={false}>
                            <InputGroup icon={User} label="Patient Name *" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} theme={{...theme, primary: modalTheme.headerColors[0]}} styles={styles} />
                            <InputGroup icon={Phone} label="Mobile Number *" keyboardType="phone-pad" value={form.mobile} onChange={(value) => setForm((prev) => ({ ...prev, mobile: value }))} theme={{...theme, primary: modalTheme.headerColors[0]}} styles={styles} />
                            <InputGroup icon={Mail} label="Email Address" keyboardType="email-address" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} theme={{...theme, primary: modalTheme.headerColors[0]}} styles={styles} placeholder="patient@email.com" />

                            <View style={{ backgroundColor: modalTheme.sectionBg, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: modalTheme.sectionBorder }}>
                                <Text style={{ color: modalTheme.subtleText, marginBottom: 8, fontWeight: '700', fontSize: 15 }}>Blood Group</Text>
                                <TouchableOpacity onPress={() => setPickerType('blood')} style={[styles.inputContainer, { backgroundColor: modalTheme.surface, borderColor: modalTheme.sectionBorder, justifyContent: 'space-between', paddingRight: 15 }]}> 
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Droplet size={20} color={modalTheme.accentText} />
                                        <Text style={{ color: theme.text, marginLeft: 10, fontSize: 16 }}>{form.blood}</Text>
                                    </View>
                                    <ChevronDown size={16} color={modalTheme.accentText} />
                                </TouchableOpacity>
                            </View>

                            {form.blood === 'Custom' && (
                                <View style={{ backgroundColor: modalTheme.sectionBg, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: modalTheme.sectionBorder, marginTop: 8 }}>
                                    <Text style={{ color: modalTheme.subtleText, marginBottom: 8, fontWeight: '700', fontSize: 15 }}>Enter Blood Group</Text>
                                    <View style={[styles.inputContainer, { backgroundColor: modalTheme.surface, borderColor: modalTheme.sectionBorder }]}> 
                                        <Droplet size={20} color={modalTheme.accentText} />
                                        <TextInput style={[styles.textInput, { color: theme.text }]} value={form.customBlood} onChangeText={(value) => setForm((prev) => ({ ...prev, customBlood: value }))} placeholder="Type blood group here..." placeholderTextColor={modalTheme.subtleText} />
                                    </View>
                                </View>
                            )}

                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <View style={{ flex: 1, backgroundColor: modalTheme.sectionBg, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: modalTheme.sectionBorder }}>
                                    <Text style={{ color: modalTheme.subtleText, marginBottom: 8, fontWeight: '700', fontSize: 15 }}>Date</Text>
                                    <TouchableOpacity onPress={() => openDatePicker('date', form.dateObj)} style={[styles.inputContainer, { backgroundColor: modalTheme.surface, borderColor: modalTheme.sectionBorder, justifyContent: 'space-between', paddingRight: 15 }]}> 
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Calendar size={20} color={modalTheme.accentText} />
                                            <Text style={{ color: theme.text, marginLeft: 10, fontSize: 16 }}>{form.date}</Text>
                                        </View>
                                        <ChevronDown size={16} color={modalTheme.accentText} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, backgroundColor: modalTheme.sectionBg, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: modalTheme.sectionBorder }}>
                                    <Text style={{ color: modalTheme.subtleText, marginBottom: 8, fontWeight: '700', fontSize: 15 }}>Time</Text>
                                    <TouchableOpacity onPress={() => openDatePicker('time', form.timeObj)} style={[styles.inputContainer, { backgroundColor: modalTheme.surface, borderColor: modalTheme.sectionBorder, justifyContent: 'space-between', paddingRight: 15 }]}> 
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Clock size={20} color={modalTheme.accentText} />
                                            <Text style={{ color: theme.text, marginLeft: 10, fontSize: 16 }}>{form.time}</Text>
                                        </View>
                                        <ChevronDown size={16} color={modalTheme.accentText} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ backgroundColor: modalTheme.sectionBg, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: modalTheme.sectionBorder }}>
                                <Text style={{ color: modalTheme.subtleText, marginBottom: 8, fontWeight: '700', fontSize: 15 }}>Booking Notes</Text>
                                <View style={{ backgroundColor: modalTheme.surface, borderWidth: 1, borderColor: modalTheme.sectionBorder, borderRadius: 16, padding: 15, minHeight: 120 }}>
                                    <TextInput style={{ color: theme.text, fontSize: 16, width: '100%', textAlignVertical: 'top', flex: 1 }} value={form.notes} onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))} placeholder="Type complaints, visit reason, or doctor's notes here..." placeholderTextColor={modalTheme.subtleText} multiline />
                                </View>
                            </View>
                        </ScrollView>

                        <View style={{ padding: 22, borderTopWidth: 1, borderTopColor: modalTheme.sectionBorder, flexDirection: 'row', gap: 14, backgroundColor: modalTheme.sectionBg }}>
                            <TouchableOpacity onPress={onClose} style={{ flex: 1, height: 52, borderRadius: 16, backgroundColor: modalTheme.cancelBg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: modalTheme.sectionBorder }}>
                                <Text style={{ color: modalTheme.cancelText, fontSize: 15, fontWeight: '700' }}>Cancel</Text>
                            </TouchableOpacity>
                            <LinearGradient colors={modalTheme.headerColors} style={{ flex: 1, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
                                <TouchableOpacity onPress={onSave} style={{ flex: 1, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
                                    <Check size={18} color="#fff" />
                                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>Save Changes</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        </>
    );
}