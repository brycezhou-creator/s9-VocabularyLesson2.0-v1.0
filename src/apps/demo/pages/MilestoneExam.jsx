import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Award, CheckCircle, XCircle, Trophy, AlertCircle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import { getWordById } from '../../../shared/data/mockWords';
import './MilestoneExam.css';

/**
 * Phase 6: 里程碑大考（Milestone Exam）
 * 触发：单词在复习池完成30天周期
 * 规则：全新语境测试，无首字母提示，无中文翻译
 * 结果：通过→绿灯永久出库 | 失败→红灯踢回P5
 */

// 模拟大考数据
const mockExamData = {
  word: {
    id: 1,
    word: 'adapt',
    examContext: {
      sentence: 'It takes time to _____ to a new school.',
      blank: 'adapt'
    }
  }
};

const MilestoneExam = () => {
  const navigate = useNavigate();
  const { promoteToGreen, demoteToRed } = useWordStore();
  
  const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [examState, setExamState] = useState('preparation'); // preparation, testing, passed, failed
  const [isShaking, setIsShaking] = useState(false);
  const [showAward, setShowAward] = useState(false);
  
  useEffect(() => {
    // 初始化考试数据
    setCurrentWord(mockExamData.word);
  }, []);
  
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };
  
  const handleSubmit = () => {
    if (!currentWord || !userInput.trim()) return;
    
    const correctAnswer = currentWord.word;
    const userAnswer = userInput.toLowerCase().trim();
    
    if (userAnswer === correctAnswer.toLowerCase()) {
      // 大考通过：变绿灯
      setExamState('passed');
      promoteToGreen(currentWord.id);
      
      // 显示奖励动画
      setTimeout(() => {
        setShowAward(true);
      }, 1000);
    } else {
      // 大考失败：变红灯
      setExamState('failed');
      demoteToRed(currentWord.id);
      triggerShake();
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && examState === 'testing') {
      handleSubmit();
    }
  };
  
  const renderBlankSentence = (sentence, targetWord) => {
    const parts = sentence.split(new RegExp(`(\\b${targetWord}\\b)`, 'gi'));
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === targetWord.toLowerCase()) {
        // 渲染空格，每个下划线作为独立元素
        return (
          <span key={index} className="exam-blanks">
            {Array(targetWord.length).fill(null).map((_, i) => (
              <React.Fragment key={i}>
                <span className="exam-blank-item">_</span>
                {i < targetWord.length - 1 && <span className="exam-blank-space"> </span>}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };
  
  if (!currentWord) {
    return (
      <div className="milestone-exam">
        <div className="exam-loading">加载考试中...</div>
      </div>
    );
  }
  
  // 准备界面
  if (examState === 'preparation') {
    return (
      <div className="milestone-exam">
        <header className="exam-header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="exam-back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="exam-header-info">
            <div className="exam-icon">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="exam-title">里程碑大考 —— 绿灯加冕</h1>
              <Badge variant="yellow" size="md">Phase 6 - Milestone</Badge>
            </div>
          </div>
        </header>
        
        <div className="exam-container">
          <Card variant="glass" padding="xl" className="exam-preparation">
            <div className="preparation-header">
              <Trophy size={64} className="preparation-icon" />
              <h2 className="preparation-title">🎉 恭喜！达到大考标准</h2>
              <p className="preparation-subtitle">{currentWord.word} 已完成复习周期</p>
            </div>
            
            <div className="preparation-progress">
              <h3 className="preparation-section-title">📅 你的复习历程</h3>
              <div className="preparation-stats-grid">
                <div className="preparation-stat">
                  <span className="preparation-stat-icon">✅</span>
                  <span className="preparation-stat-number">5</span>
                  <span className="preparation-stat-label">次成功复习</span>
                </div>
                <div className="preparation-stat">
                  <span className="preparation-stat-icon">📅</span>
                  <span className="preparation-stat-number">30</span>
                  <span className="preparation-stat-label">天持续学习</span>
                </div>
                <div className="preparation-stat">
                  <span className="preparation-stat-icon">🟡</span>
                  <span className="preparation-stat-number">黄灯</span>
                  <span className="preparation-stat-label">当前状态</span>
                </div>
              </div>
            </div>
            
            <div className="preparation-rules">
              <h3 className="preparation-section-title">🎯 大考规则</h3>
              <div className="preparation-rule-list">
                <div className="preparation-rule-item">
                  <AlertCircle size={20} />
                  <span>全新语境测试，不是原来的句子</span>
                </div>
                <div className="preparation-rule-item">
                  <AlertCircle size={20} />
                  <span>无首字母提示，无中文翻译</span>
                </div>
                <div className="preparation-rule-item">
                  <AlertCircle size={20} />
                  <span>只有一次机会，考验真实掌握</span>
                </div>
              </div>
            </div>
            
            <div className="preparation-outcome">
              <h3 className="preparation-section-title">📊 可能的结果</h3>
              <div className="preparation-outcome-grid">
                <div className="preparation-outcome-item preparation-outcome-item--success">
                  <CheckCircle size={32} />
                  <div>
                    <p className="preparation-outcome-title">通过考试</p>
                    <p className="preparation-outcome-desc">🟢 绿灯 - 永久出库</p>
                  </div>
                </div>
                <div className="preparation-outcome-item preparation-outcome-item--fail">
                  <XCircle size={32} />
                  <div>
                    <p className="preparation-outcome-title">未通过</p>
                    <p className="preparation-outcome-desc">🔴 红灯 - 踢回 P5 重修</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="preparation-encouragement">
              <p>💪 这是最后一关，相信自己！</p>
              <p>你已经复习了 30 天，现在是收获的时刻。</p>
            </div>
            
            <Button 
              onClick={() => setExamState('testing')}
              size="lg"
              className="preparation-start-btn"
            >
              开始大考
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // 通过界面
  if (examState === 'passed' && showAward) {
    return (
      <div className="milestone-exam">
        <header className="exam-header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="exam-back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="exam-header-info">
            <div className="exam-icon exam-icon--green">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="exam-title">里程碑大考 —— 绿灯加冕</h1>
              <Badge variant="green" size="md">Phase 6 - Milestone</Badge>
            </div>
          </div>
        </header>
        
        <div className="exam-container">
          <Card variant="glass" padding="xl" className="exam-award">
            <div className="award-animation">
              <div className="award-medal">
                <Award size={120} className="award-medal-icon" />
              </div>
              <h2 className="award-title">🎉 单词大师</h2>
              <p className="award-subtitle">恭喜你！{currentWord.word} 已永久掌握</p>
            </div>
            
            <div className="award-status">
              <div className="status-badge status-badge--green">
                <span className="status-light">🟢</span>
                <span className="status-text">绿灯 - 永久出库</span>
              </div>
            </div>
            
            <div className="award-details">
              <div className="detail-item">
                <CheckCircle size={20} />
                <span>✅ 满分通过</span>
              </div>
              <div className="detail-item">
                <CheckCircle size={20} />
                <span>✅ 完成30天复习周期</span>
              </div>
              <div className="detail-item">
                <CheckCircle size={20} />
                <span>✅ 全新语境验证成功</span>
              </div>
            </div>
            
            <Button onClick={() => navigate('/')} className="award-btn">
              继续学习
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // 失败界面
  if (examState === 'failed') {
    return (
      <div className="milestone-exam">
        <header className="exam-header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="exam-back-btn"
          >
            <ArrowLeft size={20} />
            返回首页
          </Button>
          <div className="exam-header-info">
            <div className="exam-icon exam-icon--red">
              <AlertCircle size={32} />
            </div>
            <div>
              <h1 className="exam-title">里程碑大考 —— 需要重修</h1>
              <Badge variant="red" size="md">Phase 6 - Failed</Badge>
            </div>
          </div>
        </header>
        
        <div className="exam-container">
          <Card variant="glass" padding="xl" className={`exam-failed ${isShaking ? 'shake' : ''}`}>
            <XCircle size={80} className="failed-icon" />
            <h2 className="failed-title">大考失败</h2>
            <p className="failed-subtitle">长时记忆还需加强</p>
            
            <div className="failed-details">
              <div className="failed-answer">
                <p className="failed-label">正确答案：</p>
                <p className="failed-word">{currentWord.word}</p>
              </div>
              <div className="failed-context">
                <p className="failed-sentence">{currentWord.examContext.sentence}</p>
              </div>
            </div>
            
            <div className="failed-status">
              <div className="status-badge status-badge--red">
                <span className="status-light">🔴</span>
                <span className="status-text">红灯 - 踢回 P5 重修</span>
              </div>
            </div>
            
            <div className="failed-message">
              <p>💪 没关系，这个词我们下节课找老师修。</p>
            </div>
            
            <Button onClick={() => navigate('/')} className="failed-btn">
              返回首页
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // 考试界面
  return (
    <div className="milestone-exam">
      {/* 头部导航 */}
      <header className="exam-header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="exam-back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="exam-header-info">
          <div className="exam-icon">
            <Trophy size={32} />
          </div>
          <div>
            <h1 className="exam-title">里程碑大考 —— 绿灯加冕</h1>
            <Badge variant="yellow" size="md">Phase 6 - Milestone</Badge>
          </div>
        </div>
      </header>
      
      {/* 主内容区域 */}
      <div className="exam-container">
        {/* 考试说明 */}
        <Card variant="glass" padding="lg" className="exam-guide">
          <div className="guide-header">
            <Trophy size={24} />
            <h3 className="guide-title">考试规则</h3>
          </div>
          <div className="guide-items">
            <div className="guide-item">
              <Badge variant="blue" size="sm">🎯 验证习得</Badge>
              <span>单词在复习池完成30天周期</span>
            </div>
            <div className="guide-item">
              <Badge variant="yellow" size="sm">📝 新语境测试</Badge>
              <span>不考初见原语境，考全新语境</span>
            </div>
            <div className="guide-item">
              <Badge variant="red" size="sm">⚠️ 无辅助</Badge>
              <span>无首字母提示，无中文翻译</span>
            </div>
          </div>
        </Card>
        
        {/* 考试卡片 */}
        <Card variant="glass" padding="xl" className={`exam-card ${isShaking ? 'shake' : ''}`}>
          <div className="exam-question">
            <h2 className="exam-context">
              {renderBlankSentence(currentWord.examContext.sentence, currentWord.examContext.blank)}
            </h2>
            <div className="exam-hints">
              <p className="exam-hint">⚠️ 无首字母提示，无中文翻译</p>
              <p className="exam-hint">🆕 全新语境，不是原语境</p>
            </div>
          </div>
          
          <div className="exam-input-section">
            <input
              type="text"
              className="exam-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入单词拼写..."
              autoFocus
              disabled={examState !== 'testing'}
            />
            <Button 
              onClick={handleSubmit}
              disabled={!userInput.trim() || examState !== 'testing'}
              className="exam-submit-btn"
            >
              提交答案
            </Button>
          </div>
        </Card>
        
        {/* 通过后的状态提示 */}
        {examState === 'passed' && !showAward && (
          <Card variant="glass" padding="lg" className="exam-feedback exam-feedback--success">
            <CheckCircle size={48} />
            <h3>✓ 满分，变🟢绿灯</h3>
            <p>正在颁发"单词大师"金牌...</p>
          </Card>
        )}
        
        {/* 结果说明 */}
        <Card variant="glass" padding="lg" className="exam-info">
          <h3 className="info-title">📊 考试结果</h3>
          <div className="info-items">
            <div className="info-item info-item--green">
              <CheckCircle size={18} />
              <span>通过 → 🟢 绿灯，永久出库</span>
            </div>
            <div className="info-item info-item--red">
              <XCircle size={18} />
              <span>失败 → 🔴 红灯，踢回 P5 重修</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MilestoneExam;
