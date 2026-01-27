import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import ConfirmDialog from '../../../shared/components/ui/ConfirmDialog';
import { ArrowLeft, RotateCcw, Clock, CheckCircle, XCircle, AlertTriangle, Calendar } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './SmartReview.css';

/**
 * 智能复习与容错（Phase 4）
 * 三级容错机制：
 * - Level 1: 手滑提示（轻微错误，震动+气泡提示，不判错不降级）
 * - Level 2: 降级助推（改错后降级为L3，给骨架提示，勉强保黄，但复习周期重置打回Day 1）
 * - Level 3: 熔断锁定（L3骨架也填不对，显示正确答案，变红灯，需要老师修复）
 */
const SmartReview = () => {
  const navigate = useNavigate();
  
  // Store状态
  const { 
    initialized, 
    initializeFromMockData,
    yellowWords, 
    getDueWords,
    reviewSuccess,
    reviewSuccessWithReset,
    reviewFailToRed
  } = useWordStore();
  
  // 组件状态
  const [reviewState, setReviewState] = useState('preview'); // preview | reviewing | completed
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [reviewWords, setReviewWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [feedbackState, setFeedbackState] = useState(null); // null | 'level1' | 'level2' | 'level3' | 'correct'
  const [errorCount, setErrorCount] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // 初始化
  useEffect(() => {
    if (!initialized) {
      initializeFromMockData();
    }
  }, [initialized, initializeFromMockData]);
  
  // 获取需要复习的单词
  useEffect(() => {
    if (initialized && yellowWords.length > 0) {
      // 模拟：获取所有黄词作为复习任务
      const wordsToReview = yellowWords.slice(0, 10).map(state => ({
        wordId: state.wordId,
        reviewCount: state.reviewCount,
        errorCount: state.errorCount
      }));
      setReviewWords(wordsToReview);
    }
  }, [initialized, yellowWords]);
  
  // 当前单词
  const currentReviewItem = reviewWords[currentWordIndex];
  const currentWord = currentReviewItem ? getWordById(currentReviewItem.wordId) : null;
  
  /**
   * 渲染单词骨架（L2提示）- 绿色字母 + 黄色空格
   */
  const renderSkeleton = (word) => {
    const chars = word.split('');
    return (
      <span className="skeleton-container">
        {chars.map((char, index) => {
          // 显示首字母、尾字母和部分中间字母
          const shouldShow = index === 0 || index === chars.length - 1 || index % 2 === 0;
          
          return (
            <span key={index} className="skeleton-char">
              {shouldShow ? (
                <span className="skeleton-char-shown">{char}</span>
              ) : (
                <span className="skeleton-char-hidden">_</span>
              )}
            </span>
          );
        })}
      </span>
    );
  };
  
  /**
   * 生成挖空的句子
   */
  const generateBlankSentence = (sentence, targetWord) => {
    // 创建正则表达式，匹配目标单词（不区分大小写，保留边界）
    const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
    
    // 计算下划线数量（与单词长度相同）
    const blanks = '_'.repeat(targetWord.length);
    
    // 替换句子中的单词为下划线
    return sentence.replace(regex, blanks);
  };
  
  /**
   * 触发震动反馈
   */
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };
  
  /**
   * 提交答案
   */
  const handleSubmit = () => {
    if (!currentWord || !userInput.trim()) return;
    
    const correctAnswer = currentWord.word;
    
    // 完全正确
    if (userInput.toLowerCase().trim() === correctAnswer.toLowerCase()) {
      if (errorCount === 0) {
        // 一次拼对 - 完美保黄
        setFeedbackState('correct');
        reviewSuccess(currentWord.id);
        setTimeout(() => moveToNextWord(), 2000);
      } else if (errorCount === 1 && feedbackState === 'level1') {
        // 震动提示后改对 - 完美保黄
        setFeedbackState('correct');
        reviewSuccess(currentWord.id);
        setTimeout(() => moveToNextWord(), 2000);
      } else if (errorCount === 2 && feedbackState === 'level2') {
        // 骨架提示后填对 - 勉强保黄，复习周期重置
        setFeedbackState('correct-reset');
        reviewSuccessWithReset(currentWord.id);
        setTimeout(() => moveToNextWord(), 2500);
      }
      return;
    }
    
    // 判断错误等级
    if (errorCount === 0) {
      // 第一次错误 - 震动提示，可以再试一次
      setFeedbackState('level1');
      setErrorCount(1);
      triggerShake();
    } else if (errorCount === 1 && feedbackState === 'level1') {
      // 第二次还错 - 显示骨架提示
      setFeedbackState('level2');
      setErrorCount(2);
      setShowSkeleton(true);
      setUserInput('');
    } else if (errorCount === 2 && feedbackState === 'level2') {
      // 第三次还错 - 爆红，熔断锁定（等待用户手动点击"我知道了"）
      setFeedbackState('level3');
      reviewFailToRed(currentWord.id, [{ type: 'spelling', value: userInput }]);
    }
  };
  
  /**
   * 进入下一个单词
   */
  const moveToNextWord = () => {
    setCompletedCount(prev => prev + 1);
    
    if (currentWordIndex < reviewWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      resetWordState();
    } else {
      // 所有单词完成
      setReviewState('completed');
    }
  };
  
  /**
   * 重置单词状态
   */
  const resetWordState = () => {
    setUserInput('');
    setFeedbackState(null);
    setErrorCount(0);
    setShowSkeleton(false);
    setIsShaking(false);
  };
  
  /**
   * 渲染反馈信息
   */
  const renderFeedback = () => {
    if (!feedbackState) return null;
    
    switch (feedbackState) {
      case 'level1':
        return (
          <div className={`review-feedback review-feedback--level1 ${isShaking ? 'shake' : ''}`}>
            <AlertTriangle size={20} />
            <span>可能点错了，再试一次～</span>
            <p className="review-feedback__hint">（不判错，再给一次机会）</p>
          </div>
        );
        
      case 'level2':
        return (
          <div className="review-feedback review-feedback--level2">
            <AlertTriangle size={20} />
            <span>看看骨架提示，能想起来吗？</span>
            <p className="review-feedback__hint">（填对后勉强保黄，但复习周期重置为 Day 1）</p>
          </div>
        );
        
      case 'level3':
        return (
          <div className="review-feedback review-feedback--level3">
            <XCircle size={24} />
            <div>
              <span className="review-feedback__title">熔断锁定 🔴</span>
              <p>没关系，这个词我们下节课找老师修。</p>
              <div className="review-feedback__answer-box">
                <p className="review-feedback__answer-label">正确答案：</p>
                <p className="review-feedback__answer-word">{currentWord?.word}</p>
                <p className="review-feedback__answer-meaning">{currentWord?.meaning?.definitionCn}</p>
                {currentWord?.context && currentWord.context[0] && (
                  <p className="review-feedback__answer-context">
                    例句：{currentWord.context[0].sentence}
                  </p>
                )}
              </div>
              <Button 
                onClick={moveToNextWord}
                className="level3-next-btn"
                variant="primary"
              >
                我知道了，下一个
              </Button>
            </div>
          </div>
        );
        
      case 'correct':
        return (
          <div className="review-feedback review-feedback--correct">
            <CheckCircle size={24} />
            <span>✓ 正确，完美保黄！</span>
            <p className="review-feedback__hint">进度条前进一格，预约下次复习</p>
          </div>
        );
        
      case 'correct-reset':
        return (
          <div className="review-feedback review-feedback--correct-reset">
            <CheckCircle size={24} />
            <span>✓ 正确，勉强保黄</span>
            <p className="review-feedback__hint">复习周期重置，打回 Day 1 重新排队</p>
          </div>
        );
        
      case 'completed':
        return null;
        
      default:
        return null;
    }
  };
  
  // 预览界面
  if (reviewState === 'preview' && reviewWords.length > 0) {
    const estimatedTime = Math.ceil(reviewWords.length * 0.5); // 每个单词约30秒
    
    return (
      <div className="smart-review">
        <header className="smart-review__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="smart-review__back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="smart-review__header-info">
            <div className="smart-review__icon">
              <RotateCcw size={32} />
            </div>
            <div>
              <h1 className="smart-review__title">智能复习与容错</h1>
              <Badge variant="blue" size="md">Phase 4</Badge>
            </div>
          </div>
        </header>
        
        <div className="smart-review__container">
          {/* 复习概览卡片 */}
          <Card variant="glass" padding="xl" className="review-preview">
            <div className="preview-header">
              <div className="preview-icon">
                <Calendar size={48} />
              </div>
              <h2 className="preview-title">今日复习任务</h2>
              <p className="preview-subtitle">按艾宾浩斯曲线自动推送</p>
            </div>
            
            <div className="preview-stats">
              <div className="preview-stat-card">
                <span className="preview-stat-number">{reviewWords.length}</span>
                <span className="preview-stat-label">待复习单词</span>
              </div>
              <div className="preview-stat-card">
                <span className="preview-stat-number">~{estimatedTime}</span>
                <span className="preview-stat-label">分钟</span>
              </div>
            </div>
            
            <div className="preview-words">
              <h3 className="preview-words-title">📝 本次复习列表</h3>
              <div className="preview-words-grid">
                {reviewWords.map((item, index) => {
                  const word = getWordById(item.wordId);
                  return (
                    <div key={item.wordId} className="preview-word-item">
                      <span className="preview-word-number">{index + 1}</span>
                      <span className="preview-word-text">{word?.word}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="preview-rules">
              <h3 className="preview-rules-title">🎯 复习规则</h3>
              <div className="preview-rules-list">
                <div className="preview-rule-item">
                  <Badge variant="green" size="sm">Level 1</Badge>
                  <span>第1次错误：震动提示，再给一次机会</span>
                </div>
                <div className="preview-rule-item">
                  <Badge variant="yellow" size="sm">Level 2</Badge>
                  <span>第2次错误：骨架提示，答对后重置周期</span>
                </div>
                <div className="preview-rule-item">
                  <Badge variant="red" size="sm">Level 3</Badge>
                  <span>第3次错误：变红灯，下节课找老师修</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setReviewState('reviewing')}
              size="lg"
              className="preview-start-btn"
            >
              开始复习 ({reviewWords.length} 个单词)
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // 完成界面
  if (reviewState === 'completed' || feedbackState === 'completed') {
    return (
      <div className="smart-review">
        <header className="smart-review__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="smart-review__back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="smart-review__header-info">
            <div className="smart-review__icon">
              <RotateCcw size={32} />
            </div>
            <div>
              <h1 className="smart-review__title">智能复习与容错</h1>
              <Badge variant="blue" size="md">Phase 4</Badge>
            </div>
          </div>
        </header>
        
        <div className="smart-review__container">
          <Card variant="glass" padding="xl" className="review-completed">
            <CheckCircle size={64} className="review-completed__icon" />
            <h2 className="review-completed__title">今日复习完成！</h2>
            <p className="review-completed__desc">
              已完成 {completedCount} 个单词的复习
            </p>
            <div className="review-completed__stats">
              <div className="stat-item">
                <Calendar size={24} />
                <span>下次复习时间将根据艾宾浩斯曲线自动推送</span>
              </div>
            </div>
            <Button onClick={() => navigate('/')}>返回首页</Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // 加载中或无数据
  if (!initialized || (reviewState === 'reviewing' && (reviewWords.length === 0 || !currentWord))) {
    return (
      <div className="smart-review">
        <header className="smart-review__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="smart-review__back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="smart-review__header-info">
            <div className="smart-review__icon">
              <RotateCcw size={32} />
            </div>
            <div>
              <h1 className="smart-review__title">智能复习与容错</h1>
              <Badge variant="blue" size="md">Phase 4</Badge>
            </div>
          </div>
        </header>
        
        <div className="smart-review__container">
          <Card variant="glass" padding="xl" className="review-loading">
            <Clock size={48} />
            <p>加载复习任务中...</p>
            {initialized && yellowWords.length === 0 && (
              <p style={{marginTop: '1rem', color: 'rgba(255,255,255,0.6)'}}>
                暂无需要复习的单词
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  }
  
  // 主复习界面
  return (
    <div className="smart-review">
      {/* 头部导航 */}
      <header className="smart-review__header">
        <Button
          variant="ghost"
          onClick={() => {
            if (reviewState === 'reviewing' && currentWordIndex > 0) {
              setShowExitConfirm(true);
            } else {
              navigate('/');
            }
          }}
          className="smart-review__back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="smart-review__header-info">
          <div className="smart-review__icon">
            <RotateCcw size={32} />
          </div>
          <div>
            <h1 className="smart-review__title">智能复习与容错</h1>
            <Badge variant="blue" size="md">Phase 4</Badge>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="smart-review__container">
        {/* 进度条 */}
        <div className="review-progress">
          <div className="review-progress__bar">
            <div 
              className="review-progress__fill" 
              style={{ width: `${(currentWordIndex / reviewWords.length) * 100}%` }}
            />
          </div>
          <p className="review-progress__text">
            {currentWordIndex + 1} / {reviewWords.length}
          </p>
        </div>
        
        {/* 复习卡片 */}
        <Card variant="glass" padding="xl" className="review-card">
          {/* 单词信息 */}
          <div className="review-card__header">
            <Badge variant="yellow" size="md">L4 全拼写</Badge>
            <p className="review-card__hint">📅 按艾宾浩斯曲线推送</p>
          </div>
          
          {/* 题目 - 挖空的句子 */}
          <div className="review-card__question">
            <h2 className="review-card__context">
              {generateBlankSentence(currentWord.context[0].sentence, currentWord.word)}
            </h2>
            <p className="review-card__translation">{currentWord.meaning.definitionCn}</p>
          </div>
          
          {/* L2骨架提示 */}
          {showSkeleton && feedbackState === 'level2' && (
            <div className="review-card__skeleton">
              <h3>💡 骨架提示：</h3>
              <div className="skeleton-text">{renderSkeleton(currentWord.word)}</div>
            </div>
          )}
          
          {/* 输入区域 */}
          <div className="review-card__input-section">
            <input
              type="text"
              className={`review-card__input ${feedbackState === 'level1' ? 'shake' : ''}`}
              placeholder="请输入单词拼写..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={feedbackState === 'level3' || feedbackState === 'correct' || feedbackState === 'correct-reset'}
              autoFocus
            />
            <Button
              onClick={handleSubmit}
              disabled={!userInput.trim() || feedbackState === 'level3' || feedbackState === 'correct' || feedbackState === 'correct-reset'}
            >
              提交
            </Button>
          </div>
          
          {/* 反馈信息 */}
          {renderFeedback()}
        </Card>
        
        {/* 三级容错说明 */}
        <Card variant="glass" padding="lg" className="review-guide">
          <h3 className="review-guide__title">三级容错机制</h3>
          <div className="review-guide__levels">
            <div className="guide-level">
              <Badge variant="blue" size="sm">第1次错</Badge>
              <span>震动提示 - 可能点错了，再试一次（不判错）</span>
            </div>
            <div className="guide-level">
              <Badge variant="yellow" size="sm">第2次错</Badge>
              <span>骨架提示 - 给出单词骨架，帮助回忆（填对后勉强保黄，复习周期重置）</span>
            </div>
            <div className="guide-level">
              <Badge variant="red" size="sm">第3次错</Badge>
              <span>熔断锁定 - 变红灯，需要老师修复（直接跳过）</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* 退出确认弹窗 */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => navigate('/')}
        title="确定要退出吗？"
        message={`当前进度：已复习 ${completedCount}/${reviewWords.length} 个单词。退出后进度将会保存。`}
        confirmText="退出复习"
        cancelText="继续复习"
        variant="warning"
      />
    </div>
  );
};

export default SmartReview;

