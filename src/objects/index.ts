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


export const BOUNDING_BOXES: SceneObject[] = [
    {
        fileName: "01.glb",
        cameraPosition: {
            x: 6.5,
            y: 3.5,
            z: 16,
        },
        annotation: { x: 1.7658803264766725, y: 1.5499998331069982, z: 12.087477606483148, type: "green" },
        data: {
            "Срок службы, лет": [23.5, "green"],
            "ИТС, %": [76.4, "green"],
            Состояние: ["Хорошее", "green"],
        },
        displayName: "Котел паровой",
    },
    {
        fileName: "02.glb",
        cameraPosition: {
            x: 1,
            y: 3.5,
            z: 18.5,
        },
        annotation: { x: -2.7750866375646144, y: 1.412572919126717, z: 12.202375411987305, type: "yellow" },
        displayName: "Турбина",
        data: {
            "Срок службы, лет": [27, "yellow"],
            "ИТС, %": [58.7, "yellow"],
            Состояние: ["Удовлетворительное", "yellow"],
        },
    },
    {
        fileName: "03.glb",
        cameraPosition: {
            x: -7.5,
            y: 4.5,
            z: 17,
        },
        annotation: { x: -11.250720977783205, y: 1.8449593975044962, z: 13.014999526387424, type: 'red' },
        data: {
            "Дебит нефти, тонн/сутки": [15.6, "green", 10, 20, 60 * 60 * 24],
            "Потребление ЭЭ, кВт/ч": [36.5, "green", 20, 50, 60],
            "Состояние фонтанной арматуры": ["Аварийное", "red"],
            "Состояние колонной головки": ["Удовлетворительное", "green"],
            "Задвижка П1, ИТС, %": [86.5, "green"],
            "Задвижка Л1, ИТС, %": [89.3, "green"],
        },
        displayName: "Скважина",
    },
    {
        fileName: "04.glb",
        cameraPosition: {
            x: -7.5,
            y: 2.5,
            z: 9.5,
        },
        annotation: { x: -11.72751978706721, y: 1.369999885559082, z: 6.945446020583546, type: "yellow" },
        displayName: "Насосная станция",
        data: {
            Состояние: ["Удовлетворительное", "yellow"],
            "Дата ввода в эксплуатацию": ['11/8/2015', "yellow"],
            "Давление на входе, мПа": [0.1, "yellow", 0.1, 0.3, 60],
            "Давление на выходе, мПа": [4, "yellow", 3.5, 4.5, 60],
            "Содержание механических примесей, %": [18, "yellow"],
        },
    },
    {
        fileName: "05.glb",
        cameraPosition: {
            x: -4.5,
            y: 9,
            z: 10.5,
        },
        annotation: { x: -10.903325418032312, y: 2.4440106147665226, z: 1.748719136415069, type: "red"},
        data: {
            "Вероятность отказа": [0.27, "red"],
            "Последствия отказа, $": [1500000, "red"],
            "Риск, $": [405000, "red"],
            "Дата ввода в эксплуатацию": ["08/23/2012", "green"],
            "Температура продукта, °С": [27.8, "green", 20, 40, 60],
            "Внутренне давление, кПа": [1.23, "green", 1, 2, 60],
            "Глубина корррозии стенки, мм": [2.6, "red"],
            "Глубина корррозии днища, мм": [0.45, "green"],
            "Глубина корррозии крыши, мм": [1.34, "yellow"],
            "Дата замера параметров": ["5/10/2023", "green"],
        },
        displayName: "Резервуар РВС-20000",
    },
    {
        fileName: "06.glb",
        cameraPosition: {
            x: -2.5,
            y: 7,
            z: 0,
        },
        annotation: { x: -10.190260049842914, y: 2.731184989639609, z: -4.920000076293945, type: "green" },
        displayName: "Трубопровод",
        data: {
            Состояние: ["Хорошее", "green"],
            "Дата ввода в эксплуатацию": ["9/14/2009", "green"],
            "Тощина стенки номанальная, мм": [6, "green"],
            "Текущая минимальная толщина стенки, мм": [5.26, "green"],
            "Скорость коррозии, мм/год": [0.05, "green"],
            "Дата замены участка трубопровода": ["9/14/2009", "green"],
        },
    },
    {
        fileName: "07.glb",
        cameraPosition: {
            x: -3.5,
            y: 15,
            z: 2,
        },
        annotation: { x: -8.887441635131838, y: 8.213585219913078, z: -7.417965260923289, type: "green" },
        displayName: "Трубопровод",
        data: {
            "Вероятность отказа": [0.13, "yellow"],
            "Последстви отказа, $": ["240,000.00", "yellow"],
            "Риск, $": ["31,200.00", "yellow"],
        },
    },
    {
        fileName: "08.glb",
        cameraPosition: {
            x: -2.5,
            y: 7.5,
            z: -2.5,
        },
        annotation: { x: -8.66512438166719, y: 4.263289826248133, z: -8.393738746643066, type: "green" },
        displayName: "Колонна",
        data: {
            "Вероятность отказа": [0.03, "green"],
            "Последстви отказа, $": ["65,000.00", "green"],
            "Риск, $": ["1,950.00", "green"],
        },
    },
    {
        fileName: "09.glb",
        cameraPosition: {
            x: -2.5,
            y: 4,
            z: -7.5,
        },
        annotation: { x: -8.419270338994462, y: 1.600000023841858, z: -12.896779986304836, type: "green" },
        data: {
            "Год выпуска": [2005, "green"],
            "Пробег, км.": [76.834, "green"],
            "Дата последнего ТО": ["2/14/2023", "green"],
            "Площадь коррозии резервуара, %": [16.9, "green"],
            "Глубина коррозии, мм.": [1.3, "green"],
        },
        displayName: "Бензовоз",
    },
    {
        fileName: "10.glb",
        cameraPosition: {
            x: 0,
            y: 4.5,
            z: -4.5,
        },
        annotation: { x: -3.3676969579533154, y: 1.540284932311117, z: -8.035249710083008, type: "orange"},
        displayName: "КТПН 1",
        data: {
            "ИТС, %": ["45.7", "orange"],
            "Уровень риска, балл из 25": [18, "orange"],
            Состояние: ["Неудовлетворительное", "orange"],
        },
    },
    {
        fileName: "11.glb",
        cameraPosition: {
            x: 6.5,
            y: 4.5,
            z: -2.5,
        },
        annotation: { x: 2.4365751282808965, y: 2.5701724218052178, z: -8.486614227294929, type: "green" },
        displayName: "ВЛЭП 6 (10) кВ",
        data: {
            "ИТС, %": [95.6, "green"],
            "Уровень риска, балл из 25": [5, "green"],
            Состояние: ["Очень хорошее", "green"],
        },
    },
    {
        fileName: "12.glb",
        cameraPosition: {
            x: 10,
            y: 4,
            z: -5.5,
        },
        annotation: { x: 8.08342431665805, y: 1.33854403235717, z: -8.035249710083008, type: "red" },
        displayName: "КТПН 2",
        data: {
            "ИТС, %": [24.6, "red"],
            "Уровень риска, балл из 25": [23, "red"],
            Состояние: ["Аварийное", "red"],
        },
    },
    {
        fileName: "13.glb",
        cameraPosition: {
            x: 23.5,
            y: 4,
            z: 9.5,
        },
        annotation: { x: 18.31440051123633, y: 0.9086602403226962, z: 4.3585557937622, type: "green" },
        displayName: "Электродвигатель",
        data: {
            "Дата ввода в эксплуатацию": ["2/3/2009", "green"],
            "Температура подшипников, °С": ["89", "green", 75, 120, 60],
            "Температура работающего двигателя, °С": ["74.5", "green", 60, 95, 60],
            "Течь масла": ["Нет", "green"],
            "Нарушение целостности заземления": ["Нет", "green"],
            "Дефект обмотки ротора": ["Нет", "green"],
            "Дефект обмотки статора": ["Нет", "green"],
        },
    },
    {
        fileName: "14.glb",
        cameraPosition: {
            x: 23.5,
            y: 6.5,
            z: 0,
        },
        annotation: { x: 18.015738643135673, y: 3.220761165885927, z: -5.489129066467285, type: "yellow" },
        displayName: "Доменная печь",
        data: {
            "Толщина коррозионных отложений, мм": [4.6, "yellow"],
            "Температура в горне печи, С°.": [1156, "yellow", 1050, 1250, 60],
        },
    },
    {
        fileName: "15.glb",
        cameraPosition: {
            x: 28,
            y: 6.5,
            z: 2,
        },
        annotation: { x: 20.70567371746629, y: 0.8496483235902446, z: -6.751444339752197, type: "red" },
        displayName: "Прокатный стан",
        data: {
            "Частота вращения двигателя, об/мин": [780, "green"],
            "Ток холостого хода, %": [17.6, "red", 5, 20, 60],
            Состояние: ["Аварийное", "red"],
        },
    },
    {
        fileName: "16.glb",
        cameraPosition: {
            x: 6.5,
            y: 2.5,
            z: 6.5,
        },
        annotation: { x: 3.6088594628314645, y: 1.3102364320540687, z: 3.517393112182617, type: "green" },
        displayName: "Силовой трансофрматор 35/6 кВ",
        data: {
            "ИТС, %": [72.7, "green"],
            Состояние: ["Хорошее", "green"],
        },
    },
];