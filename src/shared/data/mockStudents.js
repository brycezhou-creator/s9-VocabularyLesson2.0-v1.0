/**
 * Mock学生数据
 * 包含学生基本信息和单词学习状态
 */

/**
 * 单词学习状态
 * @typedef {Object} WordLearningState
 * @property {number} wordId - 单词ID
 * @property {'red'|'yellow'|'green'} status - 状态（红/黄/绿）
 * @property {number} reviewCount - 复习次数
 * @property {string} lastReviewTime - 最后复习时间
 * @property {number} errorCount - 错误次数
 * @property {string[]} errorPatterns - 错误模式（具体错在哪些字母）
 * @property {number} phase - 当前所在Phase (1-6)
 * @property {Object} phaseHistory - Phase历史记录
 */

export const MOCK_STUDENTS = [
  {
    id: 1,
    name: '小明',
    avatar: null,
    role: 'student',
    
    // 单词学习状态
    wordStates: [
      // Yellow状态单词（复习中）
      {
        wordId: 1,  // adapt
        status: 'yellow',
        reviewCount: 2,
        lastReviewTime: '2026-01-22T10:00:00Z',
        nextReviewTime: '2026-01-25T10:00:00Z',  // 3天后复习
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: true, time: '2026-01-20T10:00:00Z' },
          phase2: { passed: true, time: '2026-01-20T10:15:00Z', attempts: 1 },
          phase3: { passed: true, time: '2026-01-20T10:30:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 2,  // brave
        status: 'yellow',
        reviewCount: 1,
        lastReviewTime: '2026-01-21T14:00:00Z',
        nextReviewTime: '2026-01-24T14:00:00Z',
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: false, time: '2026-01-21T14:00:00Z' },  // 未通过筛查，进入训练
          phase2: { passed: true, time: '2026-01-21T14:10:00Z', attempts: 2 },
          phase3: { passed: true, time: '2026-01-21T14:25:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 5,  // energy
        status: 'yellow',
        reviewCount: 3,
        lastReviewTime: '2026-01-18T09:00:00Z',
        nextReviewTime: '2026-01-25T09:00:00Z',  // 7天后复习
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: true, time: '2026-01-18T09:00:00Z' },
          phase2: { passed: true, time: '2026-01-18T09:10:00Z', attempts: 1 },
          phase3: { passed: true, time: '2026-01-18T09:20:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 3,  // create
        status: 'yellow',
        reviewCount: 1,
        lastReviewTime: '2026-01-23T11:00:00Z',
        nextReviewTime: '2026-01-26T11:00:00Z',
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: true, time: '2026-01-23T11:00:00Z' },
          phase2: { passed: true, time: '2026-01-23T11:10:00Z', attempts: 1 },
          phase3: { passed: true, time: '2026-01-23T11:20:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 9,  // imagine
        status: 'yellow',
        reviewCount: 2,
        lastReviewTime: '2026-01-20T15:00:00Z',
        nextReviewTime: '2026-01-27T15:00:00Z',
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: false, time: '2026-01-20T15:00:00Z' },
          phase2: { passed: true, time: '2026-01-20T15:10:00Z', attempts: 2 },
          phase3: { passed: true, time: '2026-01-20T15:25:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 10,  // journey
        status: 'yellow',
        reviewCount: 1,
        lastReviewTime: '2026-01-22T12:00:00Z',
        nextReviewTime: '2026-01-25T12:00:00Z',
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: true, time: '2026-01-22T12:00:00Z' },
          phase2: { passed: true, time: '2026-01-22T12:10:00Z', attempts: 1 },
          phase3: { passed: true, time: '2026-01-22T12:20:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 11,  // knowledge
        status: 'yellow',
        reviewCount: 2,
        lastReviewTime: '2026-01-19T14:00:00Z',
        nextReviewTime: '2026-01-26T14:00:00Z',
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: true, time: '2026-01-19T14:00:00Z' },
          phase2: { passed: true, time: '2026-01-19T14:10:00Z', attempts: 1 },
          phase3: { passed: true, time: '2026-01-19T14:20:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 13,  // modern
        status: 'yellow',
        reviewCount: 1,
        lastReviewTime: '2026-01-24T10:00:00Z',
        nextReviewTime: '2026-01-27T10:00:00Z',
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: false, time: '2026-01-24T10:00:00Z' },
          phase2: { passed: true, time: '2026-01-24T10:10:00Z', attempts: 3 },
          phase3: { passed: true, time: '2026-01-24T10:30:00Z' },
          phase4: { inProgress: true }
        }
      },
      {
        wordId: 15,  // perfect
        status: 'yellow',
        reviewCount: 3,
        lastReviewTime: '2026-01-17T16:00:00Z',
        nextReviewTime: '2026-01-24T16:00:00Z',
        errorCount: 0,
        errorPatterns: [],
        phase: 4,
        phaseHistory: {
          phase1: { passed: true, time: '2026-01-17T16:00:00Z' },
          phase2: { passed: true, time: '2026-01-17T16:10:00Z', attempts: 1 },
          phase3: { passed: true, time: '2026-01-17T16:20:00Z' },
          phase4: { inProgress: true }
        }
      },
      
      // Red状态单词（待修补）
      {
        wordId: 4,  // difficult
        status: 'red',
        reviewCount: 0,
        lastReviewTime: '2026-01-22T15:00:00Z',
        nextReviewTime: null,  // 需要立即修补
        errorCount: 3,
        errorPatterns: ['diffic_lt', 'dificult', 'difficalt'],  // 错误拼写记录
        phase: 3,
        phaseHistory: {
          phase1: { passed: false, time: '2026-01-22T15:00:00Z' },
          phase2: { passed: true, time: '2026-01-22T15:10:00Z', attempts: 3 },
          phase3: { passed: false, time: '2026-01-22T15:25:00Z', attempts: 2 }  // L4验收失败
        },
        needsRescue: true,  // 需要进入Red Box
        rescueAttempts: 0
      },
      
      // Green状态单词（已掌握）
      {
        wordId: 6,  // famous
        status: 'green',
        reviewCount: 5,
        lastReviewTime: '2025-12-20T10:00:00Z',
        nextReviewTime: null,  // 永久出库
        errorCount: 0,
        errorPatterns: [],
        phase: 6,
        phaseHistory: {
          phase1: { passed: true, time: '2025-11-15T10:00:00Z' },
          phase2: { passed: true, time: '2025-11-15T10:10:00Z', attempts: 1 },
          phase3: { passed: true, time: '2025-11-15T10:20:00Z' },
          phase4: { completed: true, reviewCycles: 5 },
          phase6: { passed: true, time: '2025-12-20T10:00:00Z' }  // 里程碑大考通过
        },
        masteredTime: '2025-12-20T10:00:00Z'
      },
      {
        wordId: 7,  // giant
        status: 'green',
        reviewCount: 5,
        lastReviewTime: '2025-12-18T11:00:00Z',
        nextReviewTime: null,
        errorCount: 0,
        errorPatterns: [],
        phase: 6,
        phaseHistory: {
          phase1: { passed: false, time: '2025-11-14T11:00:00Z' },
          phase2: { passed: true, time: '2025-11-14T11:10:00Z', attempts: 2 },
          phase3: { passed: true, time: '2025-11-14T11:25:00Z' },
          phase4: { completed: true, reviewCycles: 5 },
          phase6: { passed: true, time: '2025-12-18T11:00:00Z' }
        },
        masteredTime: '2025-12-18T11:00:00Z'
      },
      {
        wordId: 8,  // honest
        status: 'green',
        reviewCount: 5,
        lastReviewTime: '2025-12-15T14:00:00Z',
        nextReviewTime: null,
        errorCount: 0,
        errorPatterns: [],
        phase: 6,
        phaseHistory: {
          phase1: { passed: true, time: '2025-11-10T14:00:00Z' },
          phase2: { passed: true, time: '2025-11-10T14:10:00Z', attempts: 1 },
          phase3: { passed: true, time: '2025-11-10T14:20:00Z' },
          phase4: { completed: true, reviewCycles: 5 },
          phase6: { passed: true, time: '2025-12-15T14:00:00Z' }
        },
        masteredTime: '2025-12-15T14:00:00Z'
      },
      {
        wordId: 12,  // lucky
        status: 'green',
        reviewCount: 5,
        lastReviewTime: '2025-12-22T16:00:00Z',
        nextReviewTime: null,
        errorCount: 0,
        errorPatterns: [],
        phase: 6,
        phaseHistory: {
          phase1: { passed: true, time: '2025-11-20T16:00:00Z' },
          phase2: { passed: true, time: '2025-11-20T16:05:00Z', attempts: 1 },
          phase3: { passed: true, time: '2025-11-20T16:15:00Z' },
          phase4: { completed: true, reviewCycles: 5 },
          phase6: { passed: true, time: '2025-12-22T16:00:00Z' }
        },
        masteredTime: '2025-12-22T16:00:00Z'
      },
      {
        wordId: 14,  // nature
        status: 'green',
        reviewCount: 5,
        lastReviewTime: '2025-12-19T13:00:00Z',
        nextReviewTime: null,
        errorCount: 0,
        errorPatterns: [],
        phase: 6,
        phaseHistory: {
          phase1: { passed: false, time: '2025-11-12T13:00:00Z' },
          phase2: { passed: true, time: '2025-11-12T13:10:00Z', attempts: 2 },
          phase3: { passed: true, time: '2025-11-12T13:25:00Z' },
          phase4: { completed: true, reviewCycles: 5 },
          phase6: { passed: true, time: '2025-12-19T13:00:00Z' }
        },
        masteredTime: '2025-12-19T13:00:00Z'
      }
    ],
    
    // 统计数据
    stats: {
      totalWords: 16,
      redWords: 1,
      yellowWords: 10,
      greenWords: 5,
      redWordRate: 0.06,  // 6%
      reviewBacklog: 11,  // yellow + red
      averageAccuracy: 0.85,
      totalStudyTime: 1800  // 秒
    }
  }
];

/**
 * 获取学生信息
 */
export const getStudentById = (id) => {
  return MOCK_STUDENTS.find(student => student.id === id);
};

/**
 * 获取学生的单词状态
 */
export const getWordStateByStudentAndWord = (studentId, wordId) => {
  const student = getStudentById(studentId);
  if (!student) return null;
  return student.wordStates.find(state => state.wordId === wordId);
};

/**
 * 获取学生的红词列表
 */
export const getRedWords = (studentId) => {
  const student = getStudentById(studentId);
  if (!student) return [];
  return student.wordStates.filter(state => state.status === 'red');
};

/**
 * 获取学生的黄词列表
 */
export const getYellowWords = (studentId) => {
  const student = getStudentById(studentId);
  if (!student) return [];
  return student.wordStates.filter(state => state.status === 'yellow');
};

/**
 * 获取学生的绿词列表
 */
export const getGreenWords = (studentId) => {
  const student = getStudentById(studentId);
  if (!student) return [];
  return student.wordStates.filter(state => state.status === 'green');
};

/**
 * 判断是否应该使用Model B（攻坚模式）
 */
export const shouldUseModelB = (studentId) => {
  const student = getStudentById(studentId);
  if (!student) return false;
  
  const { redWordRate, reviewBacklog } = student.stats;
  
  // 红词率 > 15% 或 积压量 > 20
  return redWordRate > 0.15 || reviewBacklog > 20;
};

