import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import { ArrowLeft, Sparkles, BookOpen, FileText, Calendar, CheckCircle } from 'lucide-react';
import './AIContext.css';

/**
 * AI 个性化语境闭环（增值服务）
 * 根据"黄灯词"积累量，自动触发两种不同的实战模式
 * - Mode A: 剧情式微阅读 (Daily)
 * - Mode B: 仿真真题演练 (Weekly)
 */
const AIContext = () => {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'A',
      title: 'Mode A: 剧情式微阅读',
      subtitle: '读得爽',
      trigger: '每节课后 (Daily)',
      data: '本节课的新词',
      experience: '你刚才背的主角，现在就在故事里',
      icon: <BookOpen size={32} />,
      iconColor: '#10B981',
      route: '/story-reading',
      features: [
        '📖 消除对长难句的恐惧',
        '✅ 验证单词在句子里的真实含义',
        '🎯 通过故事情境加深记忆'
      ]
    },
    {
      id: 'B',
      title: 'Mode B: 仿真真题演练',
      subtitle: '做得对',
      trigger: '每周日 (Weekly) 或积累满20个词',
      data: '本周所有🟡黄灯词',
      experience: '你刚才背的单词，就是这道中考常考题型的答案',
      icon: <FileText size={32} />,
      iconColor: '#A855F7',
      route: '/cloze-practice',
      features: [
        '📝 把"背单词"直接转化为"拿分能力"',
        '👨‍👩‍👧 家长最认可的显性成果',
        '🎯 仿真中考题型，提前适应'
      ]
    }
  ];

  return (
    <div className="ai-context">
      {/* 头部导航 */}
      <header className="ai-context__header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="ai-context__back-btn"
        >
          <ArrowLeft size={20} />
          返回首页
        </Button>
        <div className="ai-context__header-info">
          <div className="ai-context__icon">
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className="ai-context__title">AI 个性化语境闭环</h1>
            <Badge variant="yellow" size="md">增值服务</Badge>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <div className="ai-context__container">
        {/* 介绍卡片 */}
        <Card variant="glass" padding="xl" className="ai-context__intro">
          <h2 className="ai-context__intro-title">
            <Sparkles size={24} />
            两大 AI 战术
          </h2>
          <p className="ai-context__intro-desc">
            我们根据"黄灯词"的积累量，自动触发两种不同的实战模式
          </p>
        </Card>

        {/* 模式选择卡片 */}
        <div className="ai-context__modes">
          {modes.map((mode) => (
            <Card 
              key={mode.id} 
              variant="glass" 
              padding="xl" 
              className="mode-card"
              onClick={() => navigate(mode.route)}
            >
              <div className="mode-card__header">
                <div 
                  className="mode-card__icon" 
                  style={{ color: mode.iconColor }}
                >
                  {mode.icon}
                </div>
                <div className="mode-card__title-group">
                  <h3 className="mode-card__title">{mode.title}</h3>
                  <p className="mode-card__subtitle">—— {mode.subtitle}</p>
                </div>
              </div>

              <div className="mode-card__info">
                <div className="mode-card__info-item">
                  <Calendar size={16} />
                  <span><strong>触发：</strong>{mode.trigger}</span>
                </div>
                <div className="mode-card__info-item">
                  <Badge variant="yellow" size="sm">数据源</Badge>
                  <span>{mode.data}</span>
                </div>
              </div>

              <div className="mode-card__experience">
                <p className="mode-card__experience-label">💬 学生体验：</p>
                <p className="mode-card__experience-text">"{mode.experience}"</p>
              </div>

              <div className="mode-card__features">
                {mode.features.map((feature, index) => (
                  <div key={index} className="mode-card__feature">
                    <CheckCircle size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="mode-card__btn" size="lg">
                进入 {mode.title.split(':')[0]}
              </Button>
            </Card>
          ))}
        </div>

        {/* 说明卡片 */}
        <Card variant="glass" padding="lg" className="ai-context__note">
          <h3 className="ai-context__note-title">💡 核心理念</h3>
          <p className="ai-context__note-desc">
            所学即所用，打造"输入→理解→输出"的完整学习闭环。
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AIContext;

