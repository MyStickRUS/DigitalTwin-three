export type SceneObject = {
    fileName: string;
    cameraPosition: Coordinates;
    annotation: Coordinates & {type: FacilityStatus};
    data: { [K: string]: FacilityDataStatic | FacilityBoxDataDynamic };
    displayName: string;
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
            "x": 1.625,
            "y": 0.875,
            "z": 4
        },
        "annotation": {
            "x": 0.44,
            "y": 0.385,
            "z": 3.02,
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
            "x": 0.25,
            "y": 0.875,
            "z": 4.625
        },
        "annotation": {
            "x": -0.695,
            "y": 0.3525,
            "z": 3.05,
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
            "x": -1.875,
            "y": 1.125,
            "z": 4.25
        },
        "annotation": {
            "x": -2.815,
            "y": 0.46,
            "z": 3.2525,
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
            "x": -1.875,
            "y": 0.625,
            "z": 2.375
        },
        "annotation": {
            "x": -2.9325,
            "y": 0.34,
            "z": 1.735,
            "type": "yellow"
        },
        "displayName": "Насосная станция",
        "data": {
            "Состояние": [
                "Удовлетворительное",
                "yellow"
            ],
            "Дата ввода в эксплуатацию": [
                "11/8/2015",
                "yellow"
            ],
            "Давление на входе, мПа": [
                0.1,
                "yellow",
                0.1,
                0.3,
                60
            ],
            "Давление на выходе, мПа": [
                4,
                "yellow",
                3.5,
                4.5,
                60
            ],
            "Содержание механических примесей, %": [
                18,
                "yellow"
            ]
        }
    },
    {
        "fileName": "05.glb",
        "cameraPosition": {
            "x": -1.125,
            "y": 2.25,
            "z": 2.625
        },
        "annotation": {
            "x": -2.7275,
            "y": 0.61,
            "z": 0.435,
            "type": "red"
        },
        "data": {
            "Вероятность отказа": [
                0.27,
                "red"
            ],
            "Последствия отказа, $": [
                "1 500 000",
                "red"
            ],
            "Риск, $": [
                405000,
                "red"
            ],
            "Дата ввода в эксплуатацию": [
                "08/23/2012",
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
                "5/10/2023",
                "green"
            ]
        },
        "displayName": "Резервуар РВС-20000"
    },
    {
        "fileName": "06.glb",
        "cameraPosition": {
            "x": -0.625,
            "y": 1.75,
            "z": 0
        },
        "annotation": {
            "x": -2.55,
            "y": 0.6825,
            "z": -1.2325,
            "type": "green"
        },
        "displayName": "Трубопровод",
        "data": {
            "Состояние": [
                "Хорошее",
                "green"
            ],
            "Дата ввода в эксплуатацию": [
                "9/14/2009",
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
                "9/14/2009",
                "green"
            ]
        }
    },
    {
        "fileName": "07.glb",
        "cameraPosition": {
            "x": -0.875,
            "y": 3.75,
            "z": 0.5
        },
        "annotation": {
            "x": -2.2225,
            "y": 2.0525,
            "z": -1.855,
            "type": "green"
        },
        "displayName": "Трубопровод",
        "data": {
            "Вероятность отказа": [
                0.13,
                "yellow"
            ],
            "Последстви отказа, $": [
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
            "x": -0.625,
            "y": 1.875,
            "z": -0.625
        },
        "annotation": {
            "x": -2.1675,
            "y": 1.065,
            "z": -2.1,
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
            "x": -0.625,
            "y": 1,
            "z": -1.875
        },
        "annotation": {
            "x": -2.105,
            "y": 0.4,
            "z": -3.225,
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
                "2/14/2023",
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
            "y": 1.125,
            "z": -1.125
        },
        "annotation": {
            "x": -0.8425,
            "y": 0.385,
            "z": -2.01,
            "type": "orange"
        },
        "displayName": "КТПН 1",
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
            "x": 1.625,
            "y": 1.125,
            "z": -0.625
        },
        "annotation": {
            "x": 0.6075,
            "y": 0.6425,
            "z": -2.1225,
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
            "x": 2.5,
            "y": 1,
            "z": -1.375
        },
        "annotation": {
            "x": 2.02,
            "y": 0.3325,
            "z": -2.01,
            "type": "red"
        },
        "displayName": "КТПН 2",
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
            ]
        }
    },
    {
        "fileName": "13.glb",
        "cameraPosition": {
            "x": 5.875,
            "y": 1,
            "z": 2.375
        },
        "annotation": {
            "x": 4.5775,
            "y": 0.225,
            "z": 1.0875,
            "type": "green"
        },
        "displayName": "Электродвигатель",
        "data": {
            "Дата ввода в эксплуатацию": [
                "2/3/2009",
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
            "x": 5.875,
            "y": 1.625,
            "z": 0
        },
        "annotation": {
            "x": 4.5025,
            "y": 0.805,
            "z": -1.3725,
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
            "x": 7,
            "y": 1.625,
            "z": 0.5
        },
        "annotation": {
            "x": 5.175,
            "y": 0.21,
            "z": -1.69,
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
            "x": 1.625,
            "y": 0.625,
            "z": 1.625
        },
        "annotation": {
            "x": 0.9,
            "y": 0.3275,
            "z": 0.8775,
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