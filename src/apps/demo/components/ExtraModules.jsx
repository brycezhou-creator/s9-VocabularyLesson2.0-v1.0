import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../../../shared/components/ui/Badge';
import { RotateCcw, Sparkles, Trophy, TrendingUp } from 'lucide-react';
import './ExtraModules.css';

/**
 * 额外功能模块卡片
 * 【负责人：同事】- 只有同事需要修改这个文件
 * 
 * 包含三个模块：
 * 1. 智能复习与容错 (Phase 4)
 * 2. AI 个性化语境闭环 (增值服务)
 * 3. 里程碑大考 (Phase 6)
 */
const ExtraModules = () => {
  const navigate = useNavigate();

  // 额外模块数据
  const modules = [
    {
      id: 'smart-review',
      title: '智能复习与容错',
      subtitle: 'Phase 4',
      description: '基于艾宾浩斯曲线的智能复习系统',
      icon: <RotateCcw size={20} />,
      iconColor: '#3B82F6', // blue
      route: '/smart-review',
      badge: { variant: 'blue', text: '已上线' },
    },
    {
      id: 'ai-context',
      title: 'AI 个性化语境闭环',
      subtitle: '增值服务',
      description: 'AI 生成个性化学习场景',
      icon: <Sparkles size={20} />,
      iconColor: '#FBBF24', // yellow
      route: '/ai-context',
      badge: { variant: 'yellow', text: '已上线' },
    },
    {
      id: 'milestone',
      title: '里程碑大考',
      subtitle: 'Phase 6',
      description: '阶段性学习成果验收',
      icon: <Trophy size={20} />,
      iconColor: '#10B981', // green
      route: '/milestone',
      badge: { variant: 'green', text: '已上线' },
    },
    {
      id: 'learning-report',
      title: '学习报告',
      subtitle: '数据统计',
      description: '查看学习数据和成就',
      icon: <TrendingUp size={20} />,
      iconColor: '#10B981', // green
      route: '/learning-report',
      badge: { variant: 'green', text: '已上线' },
    },
  ];

  // 点击模块卡片
  const handleModuleClick = (route) => {
    // TODO: 同事在这里实现路由跳转逻辑
    navigate(route);
  };

  return (
    <section className="extra-modules">
      <h3 className="extra-modules__title">更多功能</h3>
      <div className="extra-modules__grid">
        {modules.map((module) => (
          <div
            key={module.id}
            className="extra-module-card"
            onClick={() => handleModuleClick(module.route)}
            role="button"
            tabIndex={0}
            aria-label={`进入${module.title}`}
          >
            <div className="extra-module-card__content">
              {/* 图标 */}
              <div
                className="extra-module-card__icon"
                style={{ color: module.iconColor }}
              >
                {module.icon}
              </div>

              {/* 文字信息 */}
              <div className="extra-module-card__info">
                <h4 className="extra-module-card__title">
                  {module.title} <span className="extra-module-card__subtitle">({module.subtitle})</span>
                </h4>
                <Badge variant={module.badge.variant} size="sm">
                  {module.badge.text}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExtraModules;

