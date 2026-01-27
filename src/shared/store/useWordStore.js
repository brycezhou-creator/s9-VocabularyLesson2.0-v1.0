import { create } from 'zustand';
import { MOCK_STUDENTS } from '../data/mockStudents';

/**
 * 单词状态机Store
 * 管理Red/Yellow/Green三态转换和复习队列
 */

const useWordStore = create((set, get) => ({
  // ========== 状态数据 ==========
  
  // 当前学生ID
  currentStudentId: 1,
  
  // 单词状态映射 { wordId: state }
  wordStates: {},
  
  // 复习队列（按时间排序）
  reviewQueue: [],
  
  // 红词列表（需要立即修补）
  redWords: [],
  
  // 黄词列表（复习中）
  yellowWords: [],
  
  // 绿词列表（已掌握）
  greenWords: [],
  
  // 是否已初始化
  initialized: false,
  
  // ========== 初始化 ==========
  
  /**
   * 从Mock数据初始化状态
   */
  initializeFromMockData: () => {
    const student = MOCK_STUDENTS.find(s => s.id === get().currentStudentId);
    if (!student) return;
    
    // 构建wordStates映射
    const wordStates = {};
    student.wordStates.forEach(state => {
      wordStates[state.wordId] = { ...state };
    });
    
    // 分类单词
    const redWords = student.wordStates.filter(s => s.status === 'red');
    const yellowWords = student.wordStates.filter(s => s.status === 'yellow');
    const greenWords = student.wordStates.filter(s => s.status === 'green');
    
    // 构建复习队列（黄词按nextReviewTime排序）
    const reviewQueue = yellowWords
      .filter(s => s.nextReviewTime)
      .map(s => ({
        wordId: s.wordId,
        nextReviewTime: s.nextReviewTime,
        priority: get().calculateReviewPriority(s)
      }))
      .sort((a, b) => new Date(a.nextReviewTime) - new Date(b.nextReviewTime));
    
    set({
      wordStates,
      redWords,
      yellowWords,
      greenWords,
      reviewQueue,
      initialized: true
    });
  },
  
  // ========== 状态查询 ==========
  
  /**
   * 获取单词状态
   */
  getWordState: (wordId) => {
    return get().wordStates[wordId] || null;
  },
  
  /**
   * 获取单词当前颜色状态
   */
  getWordStatus: (wordId) => {
    const state = get().getWordState(wordId);
    return state?.status || null;
  },
  
  /**
   * 检查单词是否需要复习
   */
  needsReview: (wordId) => {
    const state = get().getWordState(wordId);
    if (!state || state.status !== 'yellow') return false;
    
    if (!state.nextReviewTime) return false;
    return new Date(state.nextReviewTime) <= new Date();
  },
  
  /**
   * 获取需要复习的单词列表
   */
  getDueWords: () => {
    const now = new Date();
    return get().reviewQueue
      .filter(item => new Date(item.nextReviewTime) <= now)
      .map(item => item.wordId);
  },
  
  /**
   * 计算复习优先级
   */
  calculateReviewPriority: (state) => {
    // 优先级计算：错误次数越多优先级越高，复习次数越少优先级越高
    const errorWeight = state.errorCount * 2;
    const reviewWeight = Math.max(0, 5 - state.reviewCount);
    return errorWeight + reviewWeight;
  },
  
  // ========== 状态转换 ==========
  
  /**
   * Phase 3验收通过 → Yellow
   */
  transitionToYellow: (wordId) => {
    const state = get().getWordState(wordId);
    if (!state) return;
    
    const now = new Date();
    const nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3天后
    
    const newState = {
      ...state,
      status: 'yellow',
      phase: 4,
      reviewCount: 0,
      lastReviewTime: now.toISOString(),
      nextReviewTime: nextReview.toISOString()
    };
    
    get().updateWordState(wordId, newState);
    get().updateLists();
  },
  
  /**
   * 验收失败（错误≥2次）→ Red
   */
  transitionToRed: (wordId, errorPattern = []) => {
    const state = get().getWordState(wordId);
    if (!state) return;
    
    const newState = {
      ...state,
      status: 'red',
      errorCount: state.errorCount + 1,
      errorPatterns: [...state.errorPatterns, ...errorPattern],
      needsRescue: true,
      lastReviewTime: new Date().toISOString(),
      nextReviewTime: null
    };
    
    get().updateWordState(wordId, newState);
    get().updateLists();
  },
  
  /**
   * Red Box修补成功 → Yellow
   */
  rescueToYellow: (wordId) => {
    const state = get().getWordState(wordId);
    if (!state || state.status !== 'red') return;
    
    const now = new Date();
    const nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const newState = {
      ...state,
      status: 'yellow',
      phase: 4,
      reviewCount: 0,
      needsRescue: false,
      rescueAttempts: (state.rescueAttempts || 0) + 1,
      lastReviewTime: now.toISOString(),
      nextReviewTime: nextReview.toISOString()
    };
    
    get().updateWordState(wordId, newState);
    get().updateLists();
  },
  
  /**
   * 大考通过 → Green（别名：promoteToGreen）
   */
  promoteToGreen: (wordId) => {
    get().transitionToGreen(wordId);
  },
  
  /**
   * 大考失败 → Red（别名：demoteToRed）
   */
  demoteToRed: (wordId) => {
    get().transitionToRed(wordId, [{ type: 'exam', value: 'milestone_failed' }]);
  },
  
  /**
   * 复习达标（5次+30天）→ Green
   */
  transitionToGreen: (wordId) => {
    const state = get().getWordState(wordId);
    if (!state || state.status !== 'yellow') return;
    
    const now = new Date();
    
    const newState = {
      ...state,
      status: 'green',
      phase: 6,
      masteredTime: now.toISOString(),
      nextReviewTime: null
    };
    
    get().updateWordState(wordId, newState);
    get().updateLists();
  },
  
  /**
   * Yellow复习失败（容错Level 3）→ Red
   */
  reviewFailToRed: (wordId, errorPattern = []) => {
    get().transitionToRed(wordId, errorPattern);
  },
  
  /**
   * Yellow复习成功（保持Yellow）
   */
  reviewSuccess: (wordId) => {
    const state = get().getWordState(wordId);
    if (!state || state.status !== 'yellow') return;
    
    const reviewCount = state.reviewCount + 1;
    const now = new Date();
    
    // 根据复习次数确定下次复习时间
    let nextReviewDays = 3;
    if (reviewCount === 1) nextReviewDays = 3;
    else if (reviewCount === 2) nextReviewDays = 7;
    else if (reviewCount >= 3) nextReviewDays = 30;
    
    const nextReview = new Date(now.getTime() + nextReviewDays * 24 * 60 * 60 * 1000);
    
    const newState = {
      ...state,
      reviewCount,
      lastReviewTime: now.toISOString(),
      nextReviewTime: nextReview.toISOString()
    };
    
    get().updateWordState(wordId, newState);
    get().updateLists();
    
    // 检查是否达到Green条件
    if (reviewCount >= 5) {
      const firstReviewTime = new Date(state.phaseHistory?.phase3?.time || now);
      const daysPassed = (now - firstReviewTime) / (1000 * 60 * 60 * 24);
      
      if (daysPassed >= 30) {
        get().transitionToGreen(wordId);
      }
    }
  },
  
  /**
   * Yellow复习成功但降级（容错Level 2）
   */
  reviewSuccessWithReset: (wordId) => {
    const state = get().getWordState(wordId);
    if (!state || state.status !== 'yellow') return;
    
    const now = new Date();
    const nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const newState = {
      ...state,
      reviewCount: 0,  // 重置复习次数
      lastReviewTime: now.toISOString(),
      nextReviewTime: nextReview.toISOString()
    };
    
    get().updateWordState(wordId, newState);
    get().updateLists();
  },
  
  /**
   * Phase 6大考通过 → Green（绿灯，永久出库）
   */
  promoteToGreen: (wordId) => {
    get().transitionToGreen(wordId);
  },
  
  /**
   * Phase 6大考失败 → Red（红灯，踢回P5）
   */
  demoteToRed: (wordId) => {
    get().transitionToRed(wordId, [{ type: 'milestone_exam_failed', time: new Date().toISOString() }]);
  },
  
  // ========== 内部辅助方法 ==========
  
  /**
   * 更新单词状态
   */
  updateWordState: (wordId, newState) => {
    set(state => ({
      wordStates: {
        ...state.wordStates,
        [wordId]: newState
      }
    }));
  },
  
  /**
   * 更新分类列表
   */
  updateLists: () => {
    const wordStates = get().wordStates;
    const allStates = Object.values(wordStates);
    
    const redWords = allStates.filter(s => s.status === 'red');
    const yellowWords = allStates.filter(s => s.status === 'yellow');
    const greenWords = allStates.filter(s => s.status === 'green');
    
    // 重建复习队列
    const reviewQueue = yellowWords
      .filter(s => s.nextReviewTime)
      .map(s => ({
        wordId: s.wordId,
        nextReviewTime: s.nextReviewTime,
        priority: get().calculateReviewPriority(s)
      }))
      .sort((a, b) => new Date(a.nextReviewTime) - new Date(b.nextReviewTime));
    
    set({
      redWords,
      yellowWords,
      greenWords,
      reviewQueue
    });
  },
  
  // ========== 统计信息 ==========
  
  /**
   * 获取统计数据
   */
  getStats: () => {
    const { redWords, yellowWords, greenWords } = get();
    const total = redWords.length + yellowWords.length + greenWords.length;
    
    return {
      total,
      red: redWords.length,
      yellow: yellowWords.length,
      green: greenWords.length,
      redRate: total > 0 ? redWords.length / total : 0,
      reviewBacklog: redWords.length + yellowWords.length,
      needsModelB: get().shouldUseModelB()
    };
  },
  
  /**
   * 判断是否应该使用Model B
   */
  shouldUseModelB: () => {
    const stats = get().getStats();
    return stats.redRate > 0.15 || stats.reviewBacklog > 20;
  },
  
  // ========== 重置 ==========
  
  /**
   * 重置Store（用于测试）
   */
  reset: () => {
    set({
      wordStates: {},
      reviewQueue: [],
      redWords: [],
      yellowWords: [],
      greenWords: [],
      initialized: false
    });
  }
}));

export default useWordStore;

