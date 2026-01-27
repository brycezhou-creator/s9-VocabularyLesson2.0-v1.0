import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, BookOpen, Calendar, CheckCircle, XCircle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './StoryReading.css';

/**
 * Mode A: 剧情式微阅读 —— 读得爽
 * 触发：每节课后 (Daily)
 * 数据：本节课的新词（黄灯词）
 * 体验："你刚才背的主角，现在就在故事里"
 */
// 模拟故事数据（移到组件外部，避免每次渲染重新创建）
const mockStoryData = {
  title: "Tom的新生活",
  content: [
    { text: "Tom moved to a new city. It was hard to ", word: null },
    { text: "adapt", word: "adapt", highlight: true, meaning: "适应", pos: "v." },
    { text: " to his new ", word: null },
    { text: "school", word: "school", highlight: true, meaning: "学校", pos: "n." },
    { text: ". But soon, he made a new ", word: null },
    { text: "friend", word: "friend", highlight: true, meaning: "朋友", pos: "n." },
    { text: ", Jerry. They played soccer together.", word: null }
  ],
  targetWords: [
    { word: "adapt", meaning: "适应", pos: "v." },
    { word: "school", meaning: "学校", pos: "n." },
    { word: "friend", meaning: "朋友", pos: "n." }
  ],
  questions: [
    {
      question: "How did Tom feel at first?",
      options: [
        { id: 'A', text: "Happy", correct: false },
        { id: 'B', text: "Nervous", correct: true },
        { id: 'C', text: "Excited", correct: false }
      ],
      explanation: "文章中提到 'It was hard to adapt'（很难适应），说明Tom一开始感到紧张不安（Nervous）。"
    },
    {
      question: "What did Tom and Jerry do together?",
      options: [
        { id: 'A', text: "Played basketball", correct: false },
        { id: 'B', text: "Studied together", correct: false },
        { id: 'C', text: "Played soccer", correct: true }
      ],
      explanation: "文章最后一句 'They played soccer together' 明确说明他们一起踢足球。"
    }
  ]
};

const StoryReading = () => {
  const navigate = useNavigate();
  const { yellowWords } = useWordStore();
  
  const [readingState, setReadingState] = useState('preparation'); // preparation, reading, completed
  const [currentStory, setCurrentStory] = useState(mockStoryData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [clickedWord, setClickedWord] = useState(null); // 移动端点击显示释义
  
  const handleAnswerSelect = (option) => {
    if (showResult) return;
    
    setSelectedAnswer(option);
    setShowResult(true);
    
    if (option.correct) {
      setScore(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < currentStory.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };
  
  if (!currentStory) {
    return (
      <div className="story-reading">
        <div className="story-loading">加载故事中...</div>
      </div>
    );
  }
  
  // 准备界面
  if (readingState === 'preparation') {
    return (
      <div className="story-reading">
        <header className="story-reading__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="story-reading__back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="story-reading__header-info">
            <div className="story-reading__icon">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="story-reading__title">剧情式微阅读 —— 读得爽</h1>
              <Badge variant="green" size="md">Mode A - Daily</Badge>
            </div>
          </div>
        </header>
        
        <div className="story-reading__container">
          <Card variant="glass" padding="xl" className="story-preparation">
            <div className="prep-header">
              <BookOpen size={64} className="prep-icon" />
              <h2 className="prep-title">📖 今日故事已准备好</h2>
              <p className="prep-subtitle">{currentStory.title}</p>
            </div>
            
            <div className="prep-info">
              <div className="prep-info-item">
                <Badge variant="yellow" size="md">📚 本次新词</Badge>
                <span className="prep-info-value">{currentStory.targetWords.length} 个</span>
              </div>
              <div className="prep-info-item">
                <Badge variant="blue" size="md">⏱️ 预计时长</Badge>
                <span className="prep-info-value">~3 分钟</span>
              </div>
              <div className="prep-info-item">
                <Badge variant="green" size="md">📝 理解题</Badge>
                <span className="prep-info-value">{currentStory.questions.length} 道</span>
              </div>
            </div>
            
            <div className="prep-goal">
              <h3 className="prep-section-title">🎯 学习目标</h3>
              <ul className="prep-goal-list">
                <li>在故事情境中理解 {currentStory.targetWords.length} 个新词</li>
                <li>验证单词在真实句子中的用法</li>
                <li>通过阅读提升长难句理解能力</li>
              </ul>
            </div>
            
            <div className="prep-tips">
              <h3 className="prep-section-title">💡 阅读提示</h3>
              <div className="prep-tips-list">
                <div className="prep-tip-item">
                  <span className="prep-tip-highlight">黄色高亮</span>
                  <span>= 本节课的新词，悬停可看释义</span>
                </div>
                <div className="prep-tip-item">
                  <span className="prep-tip-highlight">简化句式</span>
                  <span>= 最多2个从句，降低理解难度</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setReadingState('reading')}
              size="lg"
              className="prep-start-btn"
            >
              开始阅读
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // 完成界面
  if (completed) {
    return (
      <div className="story-reading">
        <header className="story-reading__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="story-reading__back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="story-reading__header-info">
            <div className="story-reading__icon">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="story-reading__title">剧情式微阅读</h1>
              <Badge variant="green" size="md">Mode A - Daily</Badge>
            </div>
          </div>
        </header>
        
        <div className="story-reading__container">
          <Card variant="glass" padding="xl" className="story-completed">
            <CheckCircle size={64} className="story-completed__icon" />
            <h2 className="story-completed__title">今日阅读完成！</h2>
            <p className="story-completed__score">
              答对 {score} / {currentStory.questions.length} 题
            </p>
            <div className="story-completed__stats">
              <div className="stat-item">
                <span className="stat-label">📖 消除对长难句的恐惧</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">✅ 验证单词在句子里的真实含义</span>
              </div>
            </div>
            <Button onClick={() => navigate('/')}>返回首页</Button>
          </Card>
        </div>
      </div>
    );
  }
  
  const question = currentStory.questions[currentQuestion];
  
  return (
    <div className="story-reading">
      {/* 头部导航 */}
      <header className="story-reading__header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="story-reading__back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="story-reading__header-info">
          <div className="story-reading__icon">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="story-reading__title">剧情式微阅读 —— 读得爽</h1>
            <Badge variant="green" size="md">Mode A - Daily</Badge>
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <div className="story-reading__container">
        {/* 故事信息 */}
        <div className="story-info">
          <div className="story-info__tags">
            <Badge variant="blue" size="sm">
              <Calendar size={14} />
              触发：每节课后
            </Badge>
            <Badge variant="yellow" size="sm">
              📚 本节课新词：{currentStory.targetWords.length} 个
            </Badge>
          </div>
        </div>
        
        {/* 故事内容卡片 */}
        <Card variant="glass" padding="xl" className="story-card">
          <div className="story-card__header">
            <h2 className="story-card__title">📖 今日独家故事：{currentStory.title}</h2>
            <p className="story-card__subtitle">
              🎯 你刚才背的主角，现在就在故事里
            </p>
          </div>
          
          <div className="story-content">
            {currentStory.content.map((segment, index) => {
              return (
                <React.Fragment key={index}>
                  {segment.highlight ? (
                    <span className="story-word-wrapper">
                      <span 
                        className="story-word-highlight"
                        onClick={() => setClickedWord(clickedWord === index ? null : index)}
                      >
                        {segment.text}
                      </span>
                      <span className="story-word-tooltip">
                        {segment.pos} {segment.meaning}
                      </span>
                      {clickedWord === index && (
                        <div className="story-word-mobile-tooltip">
                          <span className="mobile-tooltip-text">{segment.pos} {segment.meaning}</span>
                          <button 
                            className="mobile-tooltip-close"
                            onClick={(e) => {
                              e.stopPropagation();
                              setClickedWord(null);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </span>
                  ) : (
                    <span>{segment.text}</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          <div className="story-note">
            <p>💡 脚手架提示：目标词加粗，句式简单（Max 2 clauses）</p>
            <p>💡 鼠标悬停在黄色单词上，可查看释义</p>
          </div>
        </Card>
        
        {/* 理解题卡片 */}
        <Card variant="glass" padding="xl" className="question-card">
          <div className="question-header">
            <h3 className="question-title">
              事实核查题 {currentQuestion + 1} / {currentStory.questions.length}
            </h3>
          </div>
          
          <div className="question-content">
            <p className="question-text">Q: {question.question}</p>
            
            <div className="question-options">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  className={`option-btn ${
                    selectedAnswer?.id === option.id ? 'selected' : ''
                  } ${
                    showResult && option.correct ? 'correct' : ''
                  } ${
                    showResult && selectedAnswer?.id === option.id && !option.correct ? 'wrong' : ''
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <span className="option-id">{option.id}.</span>
                  <span className="option-text">{option.text}</span>
                  {showResult && option.correct && (
                    <CheckCircle size={20} className="option-icon" />
                  )}
                  {showResult && selectedAnswer?.id === option.id && !option.correct && (
                    <XCircle size={20} className="option-icon" />
                  )}
                </button>
              ))}
            </div>
            
            {showResult && (
              <div className="question-result">
                <div className="result-feedback">
                  {selectedAnswer?.correct ? (
                    <div className="result-correct">
                      <CheckCircle size={24} />
                      <span>✓ 正确！继续保持</span>
                    </div>
                  ) : (
                    <div className="result-wrong">
                      <XCircle size={24} />
                      <div>
                        <p className="result-wrong-title">答案错误</p>
                        <p className="result-explanation">
                          <strong>📖 解析：</strong>{question.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <Button onClick={handleNextQuestion}>
                  {currentQuestion < currentStory.questions.length - 1 ? '下一题' : '完成阅读'}
                </Button>
              </div>
            )}
          </div>
        </Card>
        
        {/* 效果说明 */}
        <Card variant="glass" padding="lg" className="story-guide">
          <h3 className="story-guide__title">📊 学习效果</h3>
          <div className="story-guide__items">
            <div className="guide-item">
              <CheckCircle size={18} />
              <span>消除对长难句的恐惧</span>
            </div>
            <div className="guide-item">
              <CheckCircle size={18} />
              <span>验证单词在句子里的真实含义</span>
            </div>
            <div className="guide-item">
              <CheckCircle size={18} />
              <span>通过故事情境加深记忆</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StoryReading;
