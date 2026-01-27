import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/ui/Button';
import Badge from '../../shared/components/ui/Badge';
import ModelCards from './components/ModelCards';
import ExtraModules from './components/ExtraModules';
import ViewSelector from './components/ViewSelector';
import TodayTasks from './components/TodayTasks';
import { Play } from 'lucide-react';
import './Home.css';

/**
 * Demo首页：课程模式选择
 * 【重构说明】
 * - ModelCards: 你的专属区域（Model A/B）
 * - ExtraModules: 同事的专属区域（三个额外模块）
 * - ViewSelector: 共享组件（很少修改）
 */
const Home = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState(null);
  const [viewMode, setViewMode] = useState('demo'); // 'demo', 'student', 'teacher'

  // 进入课堂
  const handleEnterClassroom = () => {
    if (!selectedModel) return;
    
    switch (viewMode) {
      case 'demo':
        navigate(`/demo?model=${selectedModel}`);
        break;
      case 'student':
        navigate(`/student?model=${selectedModel}`);
        break;
      case 'teacher':
        navigate(`/teacher?model=${selectedModel}`);
        break;
      default:
        navigate(`/demo?model=${selectedModel}`);
    }
  };

  return (
    <div className="home">
      {/* 背景装饰 */}
      <div className="home__bg-decoration">
        <div className="home__bg-circle home__bg-circle--1" />
        <div className="home__bg-circle home__bg-circle--2" />
        <div className="home__bg-circle home__bg-circle--3" />
      </div>

      <div className="home__container">
        {/* 头部品牌区域 */}
        <header className="home__header">
          <div className="home__brand">
            <div className="home__logo">51Talk</div>
            <Badge variant="yellow" size="sm">V2.0 Demo</Badge>
          </div>
          <h1 className="home__title">单词学习产品 2.0</h1>
          <p className="home__subtitle">
            双端实时互动 · 六维数据驱动 · 精准分层训练
          </p>
        </header>

        {/* 今日待办 - 智能推荐 */}
        <TodayTasks />

        {/* Model A/B 课程模式卡片 - 你的专属区域 */}
        <ModelCards 
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />

        {/* 额外功能模块 - 同事的专属区域 */}
        <ExtraModules />

        {/* 视角选择器 - 共享组件 */}
        <ViewSelector 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* 进入按钮 */}
        <div className="home__enter-section">
          <Button
            variant="primary"
            size="lg"
            className="home__enter-btn"
            onClick={handleEnterClassroom}
            disabled={!selectedModel}
          >
            <Play size={20} />
            {selectedModel 
              ? `进入 ${selectedModel === 'A' ? '标准新授课' : '攻坚复习课'} (${viewMode === 'demo' ? '双屏' : viewMode === 'student' ? '学生' : '教师'})`
              : '请先选择课程模式'
            }
          </Button>
          {!selectedModel && (
            <p className="home__enter-hint">👆 请先点击上方卡片选择 Model A 或 Model B</p>
          )}
        </div>

        {/* 页脚 */}
        <footer className="home__footer">
          <div className="home__footer-info">
            <p>© 2024 51Talk · 单词学习产品 V2.0 · Demo版本</p>
            <p className="home__footer-tech">
              React + Vite + Zustand · 双端实时同步 · 六维数据模型
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
