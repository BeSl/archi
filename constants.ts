import { Developer, Repository, Release, Task, CodeReview, ReleaseStatus, Priority, ExtendedCodeReview } from './types';

export const MOCK_DEVELOPEPRS: Developer[] = [
  { id: 'd1', name: 'Алексей Иванов', role: 'Senior Dev', avatar: 'https://picsum.photos/id/1005/50/50', activeTasks: 3, efficiency: 92 },
  { id: 'd2', name: 'Мария Петрова', role: 'Middle Dev', avatar: 'https://picsum.photos/id/1011/50/50', activeTasks: 5, efficiency: 85 },
  { id: 'd3', name: 'Дмитрий Сидоров', role: 'Junior Dev', avatar: 'https://picsum.photos/id/1012/50/50', activeTasks: 2, efficiency: 70 },
  { id: 'd4', name: 'Елена Волкова', role: 'QA Lead', avatar: 'https://picsum.photos/id/1027/50/50', activeTasks: 4, efficiency: 95 },
];

export const MOCK_REPOSITORIES: Repository[] = [
  { id: 'r1', name: 'ERP Управление предприятием', address: 'tcp://srv-1c-01/erp_main', version: '2.5.12.87', lastCommit: '10 мин. назад', status: 'Online', branch: 'main' },
  { id: 'r2', name: 'Бухгалтерия Предприятия', address: 'tcp://srv-1c-01/buh_corp', version: '3.0.140.1', lastCommit: '2 часа назад', status: 'Online', branch: 'release/3.0.140' },
  { id: 'r3', name: 'Зарплата и Управление Персоналом', address: 'tcp://srv-1c-02/zup_dev', version: '3.1.27.54', lastCommit: '1 день назад', status: 'Syncing', branch: 'feature/payroll-calc' },
  { id: 'r4', name: 'Управление Торговлей (Legacy)', address: 'tcp://srv-1c-legacy/ut11', version: '11.4.13.56', lastCommit: '5 дней назад', status: 'Offline', branch: 'support' },
];

export const MOCK_RELEASES: Release[] = [
  { 
    id: 'rel1', 
    projectName: 'ERP 2.5 Support',
    version: '2.5.13', 
    codename: 'Spring Optimization', 
    deadline: '2024-05-30', 
    status: ReleaseStatus.TESTING, 
    progress: 85, 
    description: 'Оптимизация расчета себестоимости и закрытия месяца.',
    metadataObjects: [
        'Справочник.Контрагенты',
        'Документ.РасчетСебестоимости',
        'РегистрНакопления.СебестоимостьТоваров',
        'ОбщийМодуль.РасчетСебестоимостиСервер'
    ],
    externalResources: [
        { name: 'АнализСебестоимости.erf', type: 'Report', version: '1.0.5' }
    ]
  },
  { 
    id: 'rel2', 
    projectName: 'Платформенная Миграция',
    version: '2.6.0', 
    codename: 'Global Update', 
    deadline: '2024-07-15', 
    status: ReleaseStatus.DEVELOPMENT, 
    progress: 40, 
    description: 'Переход на платформу 8.3.24, внедрение новых подсистем интеграции.',
    metadataObjects: [
        'ПланОбмена.ИнтеграцияСМаркетплейсом',
        'Документ.ЗаказКлиента',
        'Справочник.Номенклатура'
    ],
    externalResources: [
        { name: 'ВыгрузкаНаСайт.epf', type: 'DataProcessor', version: '2.1.0' },
        { name: 'ЗагрузкаПрайсов.epf', type: 'DataProcessor', version: '1.1.4' }
    ]
  },
  { 
    id: 'rel3', 
    projectName: 'ZUP Hotfix',
    version: '2.5.12-HF2', 
    codename: 'Hotfix VAT', 
    deadline: '2024-05-12', 
    status: ReleaseStatus.DEPLOYMENT, 
    progress: 98, 
    description: 'Срочное исправление ставок НДС в печатных формах.',
    metadataObjects: [
        'ОбщийМодуль.УправлениеПечатьюБСП'
    ],
    externalResources: []
  },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Оптимизация запроса RLS в Справочник.Контрагенты', assigneeId: 'd1', status: 'In Progress', priority: Priority.CRITICAL, releaseId: 'rel1' },
  { id: 't2', title: 'Обновление БСП до версии 3.1.9', assigneeId: 'd2', status: 'Code Review', priority: Priority.HIGH, releaseId: 'rel2' },
  { id: 't3', title: 'Рефакторинг модуля ОбменДаннымиСервер', assigneeId: 'd1', status: 'To Do', priority: Priority.MEDIUM, releaseId: 'rel2' },
  { id: 't4', title: 'Добавление реквизита в Документ.ЗаказКлиента', assigneeId: 'd3', status: 'Done', priority: Priority.LOW, releaseId: 'rel1' },
  { id: 't5', title: 'Исправление ошибки блокировки транзакций', assigneeId: 'd1', status: 'In Progress', priority: Priority.CRITICAL, releaseId: 'rel3' },
];

export const MOCK_REVIEWS: ExtendedCodeReview[] = [
    {
      id: 'rev1',
      authorId: 'd3',
      reviewerId: 'd1',
      repositoryId: 'r1',
      objectName: 'Обработка.ЗагрузкаКурсовВалют',
      changes: `Процедура ЗагрузитьКурсы(ДатаНачала, ДатаОкончания) Экспорт
      
      // Вставка проверки прав
      Если Не ПравоДоступа("Использование", Метаданные.Обработки.ЗагрузкаКурсовВалют) Тогда
          ВызватьИсключение "Недостаточно прав";
      КонецЕсли;
  
      Соединение = Новый HTTPСоединение("cbr.ru");
      // ... код загрузки
  КонецПроцедуры`,
      status: 'Pending',
      timestamp: '10 мин. назад',
      comments: [
         { id: 'c1', authorName: 'Алексей Иванов', text: 'Стоит вынести проверку прав в модуль менеджера', timestamp: '5 мин. назад' }
      ],
      staticAnalysis: {
          bugs: 0,
          vulnerabilities: 0,
          codeSmells: 2,
          coverage: 85,
          duplications: 0
      }
    },
    {
      id: 'rev2',
      authorId: 'd2',
      reviewerId: 'd1',
      repositoryId: 'r2',
      objectName: 'Документ.РеализацияТоваровУслуг',
      changes: `Функция ПолучитьЦену(Номенклатура, ТипЦен)
      
      Запрос = Новый Запрос;
      Запрос.Текст = "ВЫБРАТЬ Цена ИЗ РегистрСведений.ЦеныНоменклатуры.СрезПоследних(&Период, Номенклатура = &Номенклатура И ТипЦен = &ТипЦен)";
      
      // Ошибка: Параметр Период не установлен
      Запрос.УстановитьПараметр("Номенклатура", Номенклатура);
      Запрос.УстановитьПараметр("ТипЦен", ТипЦен);
      
      Результат = Запрос.Выполнить();
      Если Результат.Пустой() Тогда Возврат 0 КонецЕсли;
      
      Возврат Результат.Выгрузить()[0].Цена;
  КонецФункции`,
      status: 'Changes Requested',
      timestamp: '2 часа назад',
      comments: [],
      staticAnalysis: {
          bugs: 1,
          vulnerabilities: 0,
          codeSmells: 5,
          coverage: 40,
          duplications: 0
      }
    }
];

export const APDEX_DATA = [
  { time: '09:00', apdex: 0.98, responseTime: 0.4 },
  { time: '10:00', apdex: 0.95, responseTime: 0.6 },
  { time: '11:00', apdex: 0.88, responseTime: 1.2 },
  { time: '12:00', apdex: 0.92, responseTime: 0.8 },
  { time: '13:00', apdex: 0.96, responseTime: 0.5 },
  { time: '14:00', apdex: 0.97, responseTime: 0.45 },
  { time: '15:00', apdex: 0.94, responseTime: 0.7 },
];

export const COVERAGE_DATA = [
  { name: 'Sprint 1', unit: 20, ui: 10, manual: 70 },
  { name: 'Sprint 2', unit: 25, ui: 15, manual: 60 },
  { name: 'Sprint 3', unit: 35, ui: 20, manual: 45 },
  { name: 'Sprint 4', unit: 42, ui: 28, manual: 30 },
  { name: 'Sprint 5', unit: 55, ui: 35, manual: 10 },
];

export const VELOCITY_DATA = [
  { name: 'W1', planned: 20, completed: 18, bugs: 2 },
  { name: 'W2', planned: 22, completed: 20, bugs: 1 },
  { name: 'W3', planned: 25, completed: 15, bugs: 8 }, // Bad week
  { name: 'W4', planned: 20, completed: 22, bugs: 3 },
];

export const PIPELINE_STATUSES = {
  'rel1': { build: 'success', test: 'running', deploy: 'pending' },
  'rel2': { build: 'failed', test: 'skipped', deploy: 'skipped' },
  'rel3': { build: 'success', test: 'success', deploy: 'success' },
};