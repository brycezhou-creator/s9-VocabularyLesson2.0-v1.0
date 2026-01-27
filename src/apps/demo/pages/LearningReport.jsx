import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, TrendingUp, Calendar, Award, Target, Clock, CheckCircle } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import './LearningReport.css';

/**
 * 学习报告页面
 * 显示学习数据、成就和趋势分析
 */
const LearningReport = () => {
  const navigate = useNavigate();
  const { getStats, redWords, yellowWords, greenWords } = useWordStore();
  
  const stats = getStats();
  
  // 模拟数据
  const weeklyData = {
    studyDays: 5,
    totalDays: 7,
    reviewedWords: 25,
    promotedToGreen: 3,
    studyMinutes: 150
  };
  
  const achievements = [
    { id: 1, title: '连续学习 5 天', icon: '🔥', unlocked: true },
    { id: 2, title: '单词大师 x3', icon: '🏆', unlocked: true },
    { id: 3, title: '完成 10 次复习', icon: '✅', unlocked: true },
    { id: 4, title: '零错误通关', icon: '💯', unlocked: false }
  ];
  
  return (
    <div className="learning-report">
      {/* 头部 */}
      <header className="report-header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="report-back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="report-header-info">
          <div className="report-icon">
            <TrendingUp size={32} />
          </div>
          <div>
            <h1 className="report-title">学习报告</h1>
            <Badge variant="blue" size="md">数据统计</Badge>
          </div>
        </div>
      </header>
      
      <div className="report-container">
        {/* 本周概览 */}
        <Card variant="glass" padding="lg" className="report-overview">
          <h2 className="report-section-title">📊 本周数据</h2>
          <div className="overview-grid">
            <div className="overview-item">
              <Calendar size={24} className="overview-icon" />
              <div className="overview-content">
                <span className="overview-value">{weeklyData.studyDays}/{weeklyData.totalDays}</span>
                <span className="overview-label">学习天数</span>
              </div>
            </div>
            <div className="overview-item">
              <CheckCircle size={24} className="overview-icon" />
              <div className="overview-content">
                <span className="overview-value">{weeklyData.reviewedWords}</span>
                <span className="overview-label">复习完成</span>
              </div>
            </div>
            <div className="overview-item">
              <Award size={24} className="overview-icon" />
              <div className="overview-content">
                <span className="overview-value">{weeklyData.promotedToGreen}</span>
                <span className="overview-label">晋升绿灯</span>
              </div>
            </div>
            <div className="overview-item">
              <Clock size={24} className="overview-icon" />
              <div className="overview-content">
                <span className="overview-value">{(weeklyData.studyMinutes / 60).toFixed(1)}h</span>
                <span className="overview-label">学习时长</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* 单词状态分布 */}
        <Card variant="glass" padding="lg" className="report-distribution">
          <h2 className="report-section-title">🎯 单词状态分布</h2>
          <div className="distribution-chart">
            <div className="distribution-bar">
              <div 
                className="distribution-segment distribution-segment--green"
                style={{width: `${(stats.green / stats.total * 100) || 0}%`}}
              />
              <div 
                className="distribution-segment distribution-segment--yellow"
                style={{width: `${(stats.yellow / stats.total * 100) || 0}%`}}
              />
              <div 
                className="distribution-segment distribution-segment--red"
                style={{width: `${(stats.red / stats.total * 100) || 0}%`}}
              />
            </div>
            <div className="distribution-legend">
              <div className="legend-item">
                <span className="legend-dot legend-dot--green"></span>
                <span className="legend-label">绿灯（已掌握）</span>
                <span className="legend-value">{stats.green}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot legend-dot--yellow"></span>
                <span className="legend-label">黄灯（复习中）</span>
                <span className="legend-value">{stats.yellow}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot legend-dot--red"></span>
                <span className="legend-label">红灯（需修补）</span>
                <span className="legend-value">{stats.red}</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* 成就系统 */}
        <Card variant="glass" padding="lg" className="report-achievements">
          <h2 className="report-section-title">🏅 成就徽章</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`achievement-item ${achievement.unlocked ? 'achievement-item--unlocked' : 'achievement-item--locked'}`}
              >
                <span className="achievement-icon">{achievement.icon}</span>
                <span className="achievement-title">{achievement.title}</span>
                {achievement.unlocked && (
                  <Badge variant="green" size="xs">已解锁</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
        
        {/* 学习建议 */}
        <Card variant="glass" padding="lg" className="report-suggestions">
          <h2 className="report-section-title">💡 学习建议</h2>
          <div className="suggestions-list">
            {stats.red > 0 && (
              <div className="suggestion-item suggestion-item--urgent">
                <AlertCircle size={20} />
                <span>建议优先修补 {stats.red} 个红灯词</span>
              </div>
            )}
            {weeklyData.studyDays < 7 && (
              <div className="suggestion-item">
                <Calendar size={20} />
                <span>本周还有 {7 - weeklyData.studyDays} 天未学习，保持连续学习更有效</span>
              </div>
            )}
            {stats.yellow >= 20 && (
              <div className="suggestion-item">
                <Target size={20} />
                <span>黄灯词已积累到 {stats.yellow} 个，可以尝试完形填空练习</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearningReport;
