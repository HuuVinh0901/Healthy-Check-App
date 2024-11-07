import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const SleepTracker = ({navigation}) => {
    const duLieuGiacNgu = [
        { gioBatDau: "22:00", gioThucDay: "06:30", ngayDiNgu: "2024-11-04" },
        { gioBatDau: "23:00", gioThucDay: "07:00", ngayDiNgu: "2024-11-05" },
        { gioBatDau: "22:30", gioThucDay: "06:00", ngayDiNgu: "2024-11-06" },
        { gioBatDau: "00:00", gioThucDay: "08:00", ngayDiNgu: "2024-11-07" },
        { gioBatDau: "23:00", gioThucDay: "07:00", ngayDiNgu: "2024-11-08" },
        { gioBatDau: "22:30", gioThucDay: "06:00", ngayDiNgu: "2024-11-09" },
        { gioBatDau: "00:00", gioThucDay: "08:00", ngayDiNgu: "2024-11-10" },
    ];

    const [trungBinhGiacNgu, setTrungBinhGiacNgu] = useState("0h 0 min");
    const [tiLe, setTiLe] = useState("0%");
    useEffect(() => {
        tinhToanThongKe();


    }, []);

    const tinhToanThongKe = () => {
        const thoiGianNgu = duLieuGiacNgu.map(record => tinhThoiGianNgu(record));
        const tongThoiGianNgu = thoiGianNgu.reduce((sum, time) => sum + time, 0);

        // Lấy số ngày từ dữ liệu
        const soNgay = duLieuGiacNgu.length;

        // Tính giờ và phút
        const trungBinh = tongThoiGianNgu / soNgay; // Chia cho số ngày
        const soGio = Math.floor(trungBinh / 60);
        const soPhut = Math.round(trungBinh % 60); // Làm tròn số phút

        const thoiGianChuan = 540 * soNgay; // phút
        const sleepRate = Math.min((tongThoiGianNgu / thoiGianChuan) * 100, 100);
        const sleepRateOver = Math.round(sleepRate);
        // Cập nhật trạng thái
        setTrungBinhGiacNgu(`${soGio}h ${soPhut} min`);
        setTiLe(`${sleepRateOver}%`)
    };




    const tinhThoiGianNgu = ({ gioBatDau, gioThucDay, ngayDiNgu }) => {
        const startTime = new Date(`${ngayDiNgu}T${gioBatDau}:00`);
        const endTime = new Date(`${ngayDiNgu}T${gioThucDay}:00`);

        // Nếu giờ thức dậy nhỏ hơn giờ đi ngủ, tăng thêm một ngày
        if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
        }

        // Tính toán thời gian ngủ bằng miligiây và chuyển đổi sang phút
        return (endTime - startTime) / (1000 * 60);
    };


    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = duLieuGiacNgu.map((record, index) => {
        const thoiGianNguThucTe = tinhThoiGianNgu(record) / 60;
        const thoiGianNen = 9; // Tổng thời gian cột nền (10 giờ)
        return { x: labels[index], thucTe: thoiGianNguThucTe, nen: thoiGianNen };
    });

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ width: '43%', justifyContent: 'center' }}
                    onPress={() => { navigation.navigate('Home') }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sleep</Text>
                </View>

            </View>
            <View style={{ marginVertical: 10, alignItems: 'center' }}>
                <Text style={styles.title}>Your average time of</Text>
                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.title}>sleep a day is</Text>
                    <Text style={styles.averageSleep}>{trungBinhGiacNgu}</Text>
                </View>

            </View>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Svg height="250" width="400">
                    <G y={50}>
                        {data.map((d, index) => (
                            <React.Fragment key={index}>
                                {/* Cột nền */}
                                <Rect
                                    x={index * 50 + 30} // Thay đổi vị trí cột
                                    y={150 - d.nen * 15} // Điều chỉnh chiều cao cột
                                    width="40"
                                    height={d.nen * 15}
                                    fill="#f3f4f6"
                                    rx="10" // Bo góc cột nền
                                    ry="10" // Bo góc cột nền
                                />
                                {/* Cột thực tế */}
                                <Rect
                                    x={index * 50 + 30}
                                    y={150 - d.thucTe * 15}
                                    width="40"
                                    height={d.thucTe * 15}
                                    fill="#a6f5ff"
                                    rx="10" // Bo góc cột thực tế
                                    ry="10" // Bo góc cột thực tế
                                />
                                {/* Nhãn cho các cột */}
                                <SvgText
                                    x={index * 50 + 50}
                                    y={180}
                                    fontSize="14"
                                    textAnchor="middle"
                                >
                                    {d.x}
                                </SvgText>
                            </React.Fragment>
                        ))}
                    </G>
                </Svg>
            </View>

            <View style={{ gap: 10, flexDirection: 'row', marginVertical: 10, marginHorizontal: 10 }}>
                <TouchableOpacity style={{ width: '49%', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderColor: '#f6f6f7', paddingVertical: 5 }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="star-rate" size={24} color="#fce100" />
                        <Text style={{ marginLeft: 5 }}>Sleep rate</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>

                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{tiLe}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '49%', alignItems: 'center', borderRadius: 20, borderWidth: 2, borderColor: '#f6f6f7', paddingVertical: 10 }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome5 name="dizzy" size={22} color="#ffc83d" />
                        <Text style={{ marginLeft: 5 }}>Deepsleep</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>

                        <Text style={{ fontSize: 13 }}>insights</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Set your schedule</Text>
                <TouchableOpacity><Text style={{ color: '#4dd6e5', fontSize: 15, fontWeight: 'bold' }}>Edit</Text></TouchableOpacity>
            </View>
            <View style={{ gap: 10, flexDirection: 'row', marginVertical: 10, marginHorizontal: 10 }}>
                <TouchableOpacity style={{ paddingLeft: 10, width: '49%', borderRadius: 20, paddingVertical: 5, backgroundColor: '#e05858' }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="bed" size={18} color="white" />
                        <Text style={{ marginLeft: 5, color: 'white' }}>Bedtime</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5 }}>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>22:00</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>pm</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft:10,width: '49%', borderRadius: 20, paddingVertical: 5, backgroundColor: '#ed7d2d' }}>
                    <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="notifications-outline" size={24} color="white" />
                        <Text style={{ marginLeft: 5,color:'white' }}>Wake up</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5 }}>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>07:30</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>am</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',

    },
    averageSleep: {
        fontSize: 20,
        marginLeft: 5,
        color: '#00c0d8',
        fontWeight: 'bold'
    },
});

export default SleepTracker;
