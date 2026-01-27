import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, FileText, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import './ClozePractice.css';

/**
 * Mode B: 仿真真题演练 —— 做得对
 * 触发：每周日 (Weekly) 或积累满20个词
 * 数据：本周所有🟡黄灯词
 * 体验："你刚才背的单词，就是这道中考常考题型的答案"
 */
const ClozePractice = () => {
  const navigate = useNavigate();
  const { yellowWords } = useWordStore();
  
  const [practiceState, setPracticeState] = useState('preparation'); // preparation, practicing, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // 模拟完形填空数据（实际应该从AI生成或预设库获取）
  const mockCloze = {
    title: "本周模拟考（仿真中考完形）",
    intro: "A chameleon is a special animal.",
    passage: [
      { text: "A chameleon is a special animal. It can change color to fit the ", type: "text" },
      { 
        id: 1, 
        type: "blank",
        correctAnswer: "B",
        explanation: "变色龙改变颜色是为了适应不同的环境（environment），这是它的生存技能。",
        options: [
          { id: "A", text: "water", meaning: "水", pos: "n.", isDistractor: "weak" },
          { id: "B", text: "environment", meaning: "环境", pos: "n.", isDistractor: false },
          { id: "C", text: "sky", meaning: "天空", pos: "n.", isDistractor: "weak" }
        ]
      },
      { text: ". This helps it to ", type: "text" },
      { 
        id: 2, 
        type: "blank",
        correctAnswer: "C",
        explanation: "上文提到变色龙改变颜色来适应环境，所以这里是帮助它'适应'（adapt to）不同的地方。",
        options: [
          { id: "A", text: "fly", meaning: "飞", pos: "v.", isDistractor: "weak" },
          { id: "B", text: "jump", meaning: "跳", pos: "v.", isDistractor: "strong" },
          { id: "C", text: "adapt", meaning: "适应", pos: "v.", isDistractor: false }
        ]
      },
      { text: " to different places. The chameleon needs to ", type: "text" },
      { 
        id: 3, 
        type: "blank",
        correctAnswer: "A",
        explanation: "变色龙改变颜色和适应环境的最终目的是为了'生存'（survive）。",
        options: [
          { id: "A", text: "survive", meaning: "生存", pos: "v.", isDistractor: false },
          { id: "B", text: "sleep", meaning: "睡觉", pos: "v.", isDistractor: "weak" },
          { id: "C", text: "run", meaning: "跑", pos: "v.", isDistractor: "strong" }
        ]
      },
      { text: " in nature. It uses this amazing ", type: "text" },
      { 
        id: 4, 
        type: "blank",
        correctAnswer: "B",
        explanation: "改变颜色是变色龙的一项'技能'（skill），用来保护自己。",
        options: [
          { id: "A", text: "sound", meaning: "声音", pos: "n.", isDistractor: "weak" },
          { id: "B", text: "skill", meaning: "技能", pos: "n.", isDistractor: false },
          { id: "C", text: "speed", meaning: "速度", pos: "n.", isDistractor: "strong" }
        ]
      },
      { text: " to protect itself from danger.", type: "text" }
    ],
    targetWords: ["environment", "adapt", "survive", "skill"],
    wordCount: 100,
    notes: [
      "📏 篇幅：100-120词，首句不挖空",
      "🎯 抽样逻辑：从本周所有黄灯词中抽取4个考查词",
      "🎯 干扰项逻辑：1正确 + 1强干扰 + 2弱干扰"
    ]
  };
  
  const blanks = mockCloze.passage.filter(item => item.type === "blank");
  const currentBlank = blanks[currentQuestion];
  
  const handleAnswerSelect = (optionId) => {
    if (showResults) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentBlank.id]: optionId
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < blanks.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    // 计算得分
    let correctCount = 0;
    blanks.forEach(blank => {
      if (answers[blank.id] === blank.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };
  
  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };
  
  const getWrongQuestions = () => {
    return blanks.filter(blank => answers[blank.id] !== blank.correctAnswer);
  };
  
  const handleReviewWrong = () => {
    // 重新开始，但只显示错题
    const wrongBlanks = getWrongQuestions();
    if (wrongBlanks.length > 0) {
      setCurrentQuestion(0);
      setAnswers({});
      setShowResults(false);
      // 这里可以进一步实现只显示错题的逻辑
    }
  };
  
  // 渲染文章内容（用于展示整体）
  const renderPassage = () => {
    return mockCloze.passage.map((item, index) => {
      if (item.type === "text") {
        return <span key={index}>{item.text}</span>;
      } else {
        const userAnswer = answers[item.id];
        const isCorrect = userAnswer === item.correctAnswer;
        return (
          <span 
            key={index} 
            className={`passage-blank ${
              showResults ? (isCorrect ? 'correct' : 'wrong') : ''
            }`}
          >
            [ {item.id} ]
          </span>
        );
      }
    });
  };
  
  // 准备界面
  if (practiceState === 'preparation') {
    return (
      <div className="cloze-practice">
        <header className="cloze-practice__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="cloze-practice__back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="cloze-practice__header-info">
            <div className="cloze-practice__icon">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="cloze-practice__title">仿真真题演练 —— 做得对</h1>
              <Badge variant="purple" size="md">Mode B - Weekly</Badge>
            </div>
          </div>
        </header>
        
        <div className="cloze-practice__container">
          <Card variant="glass" padding="xl" className="cloze-preparation">
            <div className="cloze-prep-header">
              <FileText size={64} className="cloze-prep-icon" />
              <h2 className="cloze-prep-title">📝 本周模拟考已生成</h2>
              <p className="cloze-prep-subtitle">仿真中考完形填空</p>
            </div>
            
            <div className="cloze-prep-info">
              <div className="cloze-prep-info-item">
                <Badge variant="yellow" size="md">📚 考查单词</Badge>
                <span className="cloze-prep-info-value">{blanks.length} 个</span>
              </div>
              <div className="cloze-prep-info-item">
                <Badge variant="blue" size="md">📏 文章篇幅</Badge>
                <span className="cloze-prep-info-value">100-120 词</span>
              </div>
              <div className="cloze-prep-info-item">
                <Badge variant="green" size="md">⏱️ 预计时长</Badge>
                <span className="cloze-prep-info-value">~5 分钟</span>
              </div>
            </div>
            
            <div className="cloze-prep-goal">
              <h3 className="cloze-prep-section-title">🎯 练习目标</h3>
              <ul className="cloze-prep-goal-list">
                <li>把背单词直接转化为拿分能力</li>
                <li>熟悉中考完形填空题型</li>
                <li>验证单词在考试语境中的掌握度</li>
              </ul>
            </div>
            
            <div className="cloze-prep-rules">
              <h3 className="cloze-prep-section-title">📋 答题说明</h3>
              <div className="cloze-prep-rules-list">
                <div className="cloze-prep-rule-item">
                  <CheckCircle size={18} />
                  <span>每个空格有 3 个选项（A/B/C）</span>
                </div>
                <div className="cloze-prep-rule-item">
                  <CheckCircle size={18} />
                  <span>可查看每个选项的词性和中文释义</span>
                </div>
                <div className="cloze-prep-rule-item">
                  <CheckCircle size={18} />
                  <span>答错后会显示详细解析</span>
                </div>
                <div className="cloze-prep-rule-item">
                  <AlertCircle size={18} />
                  <span>这是增值复习功能，不影响单词状态</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setPracticeState('practicing')}
              size="lg"
              className="cloze-prep-start-btn"
            >
              开始练习
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // 完成/结果界面
  if (showResults) {
    const percentage = Math.round((score / blanks.length) * 100);
    const wrongQuestions = getWrongQuestions();
    const wrongCount = wrongQuestions.length;
    
    return (
      <div className="cloze-practice">
        <header className="cloze-practice__header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="cloze-practice__back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="cloze-practice__header-info">
            <div className="cloze-practice__icon">
              <FileText size={32} />
            </div>
            <div>
              <h1 className="cloze-practice__title">仿真真题演练</h1>
              <Badge variant="purple" size="md">Mode B - Weekly</Badge>
            </div>
          </div>
        </header>
        
        <div className="cloze-practice__container">
          <Card variant="glass" padding="xl" className="cloze-results">
            <div className="results-header">
              <CheckCircle size={64} className="results-icon" />
              <h2 className="results-title">本周模拟考完成！</h2>
              <div className="results-score">
                <span className="score-number">{score}</span>
                <span className="score-divider">/</span>
                <span className="score-total">{blanks.length}</span>
              </div>
              <div className="results-percentage">
                正确率：{percentage}%
              </div>
              
              {wrongCount > 0 && (
                <div className="results-wrong-summary">
                  <AlertCircle size={20} />
                  <span>本次错误：{wrongCount} 题</span>
                </div>
              )}
            </div>
            
            {wrongCount > 0 && (
              <div className="wrong-book-banner">
                <div className="wrong-book-info">
                  <XCircle size={24} />
                  <div>
                    <p className="wrong-book-title">📕 错题本</p>
                    <p className="wrong-book-desc">建议重点复习错误的 {wrongCount} 题</p>
                  </div>
                </div>
                <div className="wrong-book-actions">
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      // 只显示错题
                      const wrongIds = wrongQuestions.map(q => q.id);
                      setCurrentQuestion(0);
                      setShowResults(false);
                    }}
                  >
                    查看错题解析
                  </Button>
                </div>
              </div>
            )}
            
            <div className="results-details">
              <h3>答题详情</h3>
              <div className="results-list">
                {blanks.map((blank) => {
                  const userAnswer = answers[blank.id];
                  const isCorrect = userAnswer === blank.correctAnswer;
                  const correctOption = blank.options.find(opt => opt.id === blank.correctAnswer);
                  const userOption = blank.options.find(opt => opt.id === userAnswer);
                  
                  return (
                    <div key={blank.id} className={`result-item ${isCorrect ? 'correct' : 'wrong'}`}>
                      <div className="result-item__header">
                        <span className="result-item__number">第 {blank.id} 题</span>
                        {isCorrect ? (
                          <CheckCircle size={20} className="result-item__icon" />
                        ) : (
                          <XCircle size={20} className="result-item__icon" />
                        )}
                      </div>
                      <div className="result-item__content">
                        <div className="result-row">
                          <span className="result-label">你的答案：</span>
                          <span className={`result-value ${isCorrect ? 'correct' : 'wrong'}`}>
                            {userOption ? `${userOption.text} (${userOption.pos} ${userOption.meaning})` : '未作答'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <>
                            <div className="result-row">
                              <span className="result-label">正确答案：</span>
                              <span className="result-value correct">
                                {correctOption?.text} ({correctOption?.pos} {correctOption?.meaning})
                              </span>
                            </div>
                            <div className="result-explanation">
                              <span className="result-explanation__label">📖 解析：</span>
                              <p className="result-explanation__text">{blank.explanation}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="results-note">
              <AlertCircle size={20} />
              <p>⚠️ 重要：这是增值复习功能，不做状态流转</p>
            </div>
            
            <div className="results-actions">
              <Button variant="secondary" onClick={handleReset}>
                再做一次
              </Button>
              <Button onClick={() => navigate('/')}>
                返回首页
              </Button>
            </div>
          </Card>
          
          {/* 效果说明 */}
          <Card variant="glass" padding="lg" className="cloze-guide">
            <h3 className="cloze-guide__title">📊 学习效果</h3>
            <div className="cloze-guide__items">
              <div className="guide-item">
                <CheckCircle size={18} />
                <span>把"背单词"直接转化为"拿分能力"</span>
              </div>
              <div className="guide-item">
                <CheckCircle size={18} />
                <span>家长最认可的显性成果</span>
              </div>
              <div className="guide-item">
                <CheckCircle size={18} />
                <span>仿真中考题型，提前适应</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cloze-practice">
      {/* 头部导航 */}
      <header className="cloze-practice__header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="cloze-practice__back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="cloze-practice__header-info">
          <div className="cloze-practice__icon">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="cloze-practice__title">仿真真题演练 —— 做得对</h1>
            <Badge variant="purple" size="md">Mode B - Weekly</Badge>
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <div className="cloze-practice__container">
        {/* 题目信息 */}
        <div className="cloze-info">
          <div className="cloze-info__tags">
            <Badge variant="blue" size="sm">
              <Calendar size={14} />
              触发：每周日或积累满20词
            </Badge>
            <Badge variant="yellow" size="sm">
              📚 本周黄灯词：{mockCloze.targetWords.length} 个
            </Badge>
          </div>
        </div>
        
        {/* 文章卡片 */}
        <Card variant="glass" padding="xl" className="passage-card">
          <div className="passage-card__header">
            <h2 className="passage-card__title">📝 {mockCloze.title}</h2>
            <div className="passage-card__meta">
              <span>约 {mockCloze.wordCount} 词</span>
              <span>•</span>
              <span>共 {blanks.length} 道题</span>
            </div>
          </div>
          
          <div className="passage-content">
            {renderPassage()}
          </div>
          
          <div className="passage-notes">
            {mockCloze.notes.map((note, index) => (
              <p key={index}>{note}</p>
            ))}
          </div>
        </Card>
        
        {/* 当前题目卡片 */}
        <Card variant="glass" padding="xl" className="question-card">
          <div className="question-progress">
            <span className="progress-current">第 {currentBlank.id} 题</span>
            <span className="progress-divider">/</span>
            <span className="progress-total">{blanks.length}</span>
          </div>
          
          <div className="question-options">
            {currentBlank.options.map((option) => {
              const isSelected = answers[currentBlank.id] === option.id;
              
              return (
                <button
                  key={option.id}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(option.id)}
                >
                  <span className="option-id">{option.id}.</span>
                  <div className="option-content">
                    <span className="option-text">{option.text}</span>
                    <span className="option-meaning">{option.pos} {option.meaning}</span>
                  </div>
                  {isSelected && <CheckCircle size={20} className="option-icon" />}
                </button>
              );
            })}
          </div>
          
          <div className="question-actions">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              上一题
            </Button>
            
            {currentQuestion < blanks.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!answers[currentBlank.id]}
              >
                下一题
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < blanks.length}
              >
                提交答案
              </Button>
            )}
          </div>
          
          {Object.keys(answers).length < blanks.length && (
            <div className="question-hint">
              <AlertCircle size={16} />
              <span>已完成 {Object.keys(answers).length} / {blanks.length} 题</span>
            </div>
          )}
        </Card>
        
        {/* 效果说明 */}
        <Card variant="glass" padding="lg" className="cloze-guide">
          <h3 className="cloze-guide__title">💡 做题技巧</h3>
          <div className="cloze-guide__items">
            <div className="guide-item">
              <span className="guide-number">1</span>
              <span>先通读全文，理解大意</span>
            </div>
            <div className="guide-item">
              <span className="guide-number">2</span>
              <span>根据上下文选择最合适的词</span>
            </div>
            <div className="guide-item">
              <span className="guide-number">3</span>
              <span>注意句子的逻辑关系</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClozePractice;
