export type SceneObject = {
    fileName: string;
    cameraPosition: Coordinates;
    annotation: Partial<Coordinates> & {type: FacilityStatus};
    data: { [K: string]: FacilityDataStatic | FacilityBoxDataDynamic };
    displayName: string;
    passportURI?: string;
};

export type FacilityDataStatic = [number | string, FacilityStatus];

type FacilityStatus = "red" | "yellow" | "green" | "orange";

/**
 * initialValue
 *
 * isDynamic
 *
 * minValue
 *
 * maxValue
 *
 * updateSeconds
 */
export type FacilityBoxDataDynamic = [number | string, FacilityStatus, number, number, number];

interface Coordinates {
    x: number;
    y: number;
    z: number;
}


export const BOUNDING_BOXES: SceneObject[] = 
[
    {
        "fileName": "01.glb",
        "cameraPosition": {
            "x": 0.975,
            "y": 0.525,
            "z": 2.4
        },
        "annotation": {
            "x": 0.264,
            "y": 0.231,
            "z": 1.812,
            "type": "green"
        },
        "data": {
            "Срок службы, лет": [
                23.5,
                "green"
            ],
            "ИТС, %": [
                76.4,
                "green"
            ],
            "Состояние": [
                "Хорошее",
                "green"
            ]
        },
        "displayName": "Котел паровой"
    },
    {
        "fileName": "02.glb",
        "cameraPosition": {
            "x": 0.15,
            "y": 0.525,
            "z": 2.775
        },
        "annotation": {
            "x": -0.417,
            "y": 0.21149999999999997,
            "z": 1.8299999999999996,
            "type": "yellow"
        },
        "displayName": "Турбина",
        "data": {
            "Срок службы, лет": [
                27,
                "yellow"
            ],
            "ИТС, %": [
                58.7,
                "yellow"
            ],
            "Состояние": [
                "Удовлетворительное",
                "yellow"
            ]
        }
    },
    {
        "fileName": "03.glb",
        "cameraPosition": {
            "x": -1.125,
            "y": 0.675,
            "z": 2.55
        },
        "annotation": {
            "x": -1.689,
            "y": 0.276,
            "z": 1.9515,
            "type": "red"
        },
        "data": {
            "Дебит нефти, тонн/сутки": [
                15.6,
                "green",
                10,
                20,
                86400
            ],
            "Потребление ЭЭ, кВт/ч": [
                36.5,
                "green",
                20,
                50,
                60
            ],
            "Состояние фонтанной арматуры": [
                "Аварийное",
                "red"
            ],
            "Состояние колонной головки": [
                "Удовлетворительное",
                "green"
            ],
            "Задвижка П1, ИТС, %": [
                86.5,
                "green"
            ],
            "Задвижка Л1, ИТС, %": [
                89.3,
                "green"
            ]
        },
        "displayName": "Скважина"
    },
    {
        "fileName": "04.glb",
        "cameraPosition": {
            "x": -1.125,
            "y": 0.375,
            "z": 1.425
        },
        "annotation": {
            "x": -1.7594999999999998,
            "y": 0.20400000000000001,
            "z": 1.041,
            "type": "yellow"
        },
        "displayName": "Насосная станция №2",
        passportURI: "http://192.168.4.86/EnergySubAnalysis_DetailView/b84ff16c-645a-4db7-b9a3-bb208f4dc199",
        "data": {
            "УРЭ НА-4 (кВт*ч/м3)": [
                "23,04 (+13,04)",
                "red"
            ],
            "Потенциал энергоэффективности НА-4 (кВт*ч/м3)": [
                "18,6",
                "green"
            ],
            "Рекомендация": [
                "Замена насоса",
                "green"
            ],
            "Риск": [
                "10/50 (низкий)",
                "green"
            ],
            "ИТС": [
                "83/100 (хорошее состояние)",
                "green"
            ],
        }
    },
    {
        "fileName": "05.glb",
        "cameraPosition": {
            "x": -0.675,
            "y": 1.35,
            "z": 1.575
        },
        "annotation": {
            "x": -1.6365000000000003,
            "y": 0.366,
            "z": 0.261,
            "type": "red"
        },
        "data": {
            "Вероятность отказа": [
                0.27,
                "red"
            ],
            "Последствия отказа, $": [
                1500000,
                "red"
            ],
            "Риск, $": [
                405000,
                "red"
            ],
            "Дата ввода в эксплуатацию": [
                "08.23.2012",
                "green"
            ],
            "Температура продукта, °С": [
                27.8,
                "green",
                20,
                40,
                60
            ],
            "Внутренне давление, кПа": [
                1.23,
                "green",
                1,
                2,
                60
            ],
            "Глубина корррозии стенки, мм": [
                2.6,
                "red"
            ],
            "Глубина корррозии днища, мм": [
                0.45,
                "green"
            ],
            "Глубина корррозии крыши, мм": [
                1.34,
                "yellow"
            ],
            "Дата замера параметров": [
                "5.10.2023",
                "green"
            ]
        },
        "displayName": "Резервуар РВС-20000",
        passportURI: "http://94.79.54.196:38081/equipmentPassport/368",
    },
    {
        "fileName": "06.glb",
        "cameraPosition": {
            "x": -0.375,
            "y": 1.05,
            "z": 0
        },
        "annotation": {
            "x": -1.7,
            "y": 0.4,
            "z": -0.7,
            "type": "green"
        },
        "displayName": "Трубопровод",
        "data": {
            "Состояние": [
                "Хорошее",
                "green"
            ],
            "Дата ввода в эксплуатацию": [
                "9.14.2009",
                "green"
            ],
            "Тощина стенки номанальная, мм": [
                6,
                "green"
            ],
            "Текущая минимальная толщина стенки, мм": [
                5.26,
                "green"
            ],
            "Скорость коррозии, мм/год": [
                0.05,
                "green"
            ],
            "Дата замены участка трубопровода": [
                "9.14.2009",
                "green"
            ]
        }
    },
    {
        "fileName": "07.glb",
        "cameraPosition": {
            "x": -0.525,
            "y": 2.25,
            "z": 0.3
        },
        "annotation": {
            "x": -1.3335000000000001,
            "y": 1.2315,
            "z": -1.113,
            "type": "green"
        },
        "displayName": "Трубопровод",
        "data": {
            "Вероятность отказа": [
                0.13,
                "yellow"
            ],
            "Последствия отказа, $": [
                "240,000.00",
                "yellow"
            ],
            "Риск, $": [
                "31,200.00",
                "yellow"
            ]
        }
    },
    {
        "fileName": "08.glb",
        "cameraPosition": {
            "x": -0.375,
            "y": 1.125,
            "z": -0.375
        },
        "annotation": {
            "x": -1.3005,
            "y": 0.639,
            "z": -1.2600000000000002,
            "type": "green"
        },
        "displayName": "Колонна",
        "data": {
            "Вероятность отказа": [
                0.03,
                "green"
            ],
            "Последстви отказа, $": [
                "65,000.00",
                "green"
            ],
            "Риск, $": [
                "1,950.00",
                "green"
            ]
        }
    },
    {
        "fileName": "09.glb",
        "cameraPosition": {
            "x": -0.375,
            "y": 0.6,
            "z": -1.125
        },
        "annotation": {
            "x": -1.263,
            "y": 0.24000000000000005,
            "z": -1.935,
            "type": "green"
        },
        "data": {
            "Год выпуска": [
                2005,
                "green"
            ],
            "Пробег, км.": [
                76.834,
                "green"
            ],
            "Дата последнего ТО": [
                "2.14.2023",
                "green"
            ],
            "Площадь коррозии резервуара, %": [
                16.9,
                "green"
            ],
            "Глубина коррозии, мм.": [
                1.3,
                "green"
            ]
        },
        "displayName": "Бензовоз"
    },
    {
        "fileName": "10.glb",
        "cameraPosition": {
            "x": 0,
            "y": 0.675,
            "z": -0.675
        },
        "annotation": {
            "x": -0.5055,
            "y": 0.231,
            "z": -1.206,
            "type": "orange"
        },
        "displayName": "КТПН 1",
        passportURI: "http://94.79.54.196:18080/equipmentPassport/3141765",
        "data": {
            "ИТС, %": [
                "45.7",
                "orange"
            ],
            "Уровень риска, балл из 25": [
                18,
                "orange"
            ],
            "Состояние": [
                "Неудовлетворительное",
                "orange"
            ]
        }
    },
    {
        "fileName": "11.glb",
        "cameraPosition": {
            "x": 0.975,
            "y": 0.675,
            "z": -0.375
        },
        "annotation": {
            "x": 0.36450000000000005,
            "y": 0.38549999999999995,
            "z": -1.2734999999999999,
            "type": "green"
        },
        "displayName": "ВЛЭП 6 (10) кВ",
        "data": {
            "ИТС, %": [
                95.6,
                "green"
            ],
            "Уровень риска, балл из 25": [
                5,
                "green"
            ],
            "Состояние": [
                "Очень хорошее",
                "green"
            ]
        }
    },
    {
        "fileName": "12.glb",
        "cameraPosition": {
            "x": 1.5,
            "y": 0.6,
            "z": -0.825
        },
        "annotation": {
            "x": 1.2120000000000002,
            "y": 0.1995,
            "z": -1.206,
            "type": "red"
        },
        "displayName": "КТПН 2",
        passportURI: "http://94.79.54.196:18080/equipmentPassport/3141765",
        "data": {
            "ИТС, %": [
                24.6,
                "red"
            ],
            "Уровень риска, балл из 25": [
                23,
                "red"
            ],
            "Состояние": [
                "Аварийное",
                "red"
            ],
            "Дефект заземлителя нейтрали трансформатора Т1": [
                "Аварийное",
                "red"
            ],
        }
    },
    {
        "fileName": "13.glb",
        "cameraPosition": {
            "x": 3.525,
            "y": 0.6,
            "z": 1.425
        },
        "annotation": {
            "x": 2.7464999999999997,
            "y": 0.135,
            "z": 0.6525,
            "type": "green"
        },
        "displayName": "Электродвигатель",
        "data": {
            "Дата ввода в эксплуатацию": [
                "2.3.2009",
                "green"
            ],
            "Температура подшипников, °С": [
                "89",
                "green",
                75,
                120,
                60
            ],
            "Температура работающего двигателя, °С": [
                "74.5",
                "green",
                60,
                95,
                60
            ],
            "Течь масла": [
                "Нет",
                "green"
            ],
            "Нарушение целостности заземления": [
                "Нет",
                "green"
            ],
            "Дефект обмотки ротора": [
                "Нет",
                "green"
            ],
            "Дефект обмотки статора": [
                "Нет",
                "green"
            ]
        }
    },
    {
        "fileName": "14.glb",
        "cameraPosition": {
            "x": 3.525,
            "y": 0.975,
            "z": 0
        },
        "annotation": {
            "x": 2.7015000000000002,
            "y": 0.483,
            "z": -0.8234999999999999,
            "type": "yellow"
        },
        "displayName": "Доменная печь",
        "data": {
            "Толщина коррозионных отложений, мм": [
                4.6,
                "yellow"
            ],
            "Температура в горне печи, С°.": [
                1156,
                "yellow",
                1050,
                1250,
                60
            ]
        }
    },
    {
        "fileName": "15.glb",
        "cameraPosition": {
            "x": 4.2,
            "y": 0.975,
            "z": 0.3
        },
        "annotation": {
            "x": 3.1049999999999995,
            "y": 0.126,
            "z": -1.014,
            "type": "red"
        },
        "displayName": "Прокатный стан",
        "data": {
            "Частота вращения двигателя, об/мин": [
                780,
                "green"
            ],
            "Ток холостого хода, %": [
                17.6,
                "red",
                5,
                20,
                60
            ],
            "Состояние": [
                "Аварийное",
                "red"
            ]
        }
    },
    {
        "fileName": "16.glb",
        "cameraPosition": {
            "x": 0.975,
            "y": 0.375,
            "z": 0.975
        },
        "annotation": {
            "x": 0.54,
            "y": 0.1965,
            "z": 0.5265,
            "type": "green"
        },
        "displayName": "Силовой трансформатор 35/6 кВ",
        "data": {
            "ИТС, %": [
                72.7,
                "green"
            ],
            "Состояние": [
                "Хорошее",
                "green"
            ]
        }
    }
]