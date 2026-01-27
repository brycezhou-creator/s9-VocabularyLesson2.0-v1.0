import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../shared/components/ui/Card';
import Badge from '../../../shared/components/ui/Badge';
import Button from '../../../shared/components/ui/Button';
import { Calendar, AlertCircle, BookOpen, FileText, Trophy, ChevronRight } from 'lucide-react';
import useWordStore from '../../../shared/store/useWordStore';
import './TodayTasks.css';

/**
 * 今日待办卡片 - 智能推荐
 * 显示用户当前应该做的任务，按优先级排序
 */
const TodayTasks = () => {
  const navigate = useNavigate();
  const { redWords, yellowWords, greenWords, getDueWords } = useWordStore();
  
  const dueWordsCount = getDueWords ? getDueWords().length : 0;
  const redCount = redWords.length;
  const yellowCount = yellowWords.length;
  
  const tasks = [];
  
  // 红灯词（最高优先级）
  if (redCount > 0) {
    tasks.push({
      id: 'red-rescue',
      title: `${redCount} 个红灯词需要修补`,
      desc: '需要老师协助修复',
      icon: AlertCircle,
      color: 'red',
      badge: '紧急',
      badgeVariant: 'red',
      action: () => navigate('/milestone'), // 暂时跳转到里程碑页面
      priority: 1
    });
  }
  
  // 待复习单词（高优先级）
  if (dueWordsCount > 0) {
    tasks.push({
      id: 'review-due',
      title: `${dueWordsCount} 个单词待复习`,
      desc: '按艾宾浩斯曲线推送',
      icon: Calendar,
      color: 'blue',
      badge: '今日必做',
      badgeVariant: 'blue',
      action: () => navigate('/smart-review'),
      priority: 2
    });
  }
  
  // 今日故事（中优先级）
  if (yellowCount > 0) {
    tasks.push({
      id: 'story-reading',
      title: '今日故事已解锁',
      desc: '在故事中复习新词',
      icon: BookOpen,
      color: 'green',
      badge: '增值服务',
      badgeVariant: 'green',
      action: () => navigate('/story-reading'),
      priority: 3
    });
  }
  
  // 本周模拟考（中优先级）
  if (yellowCount >= 4) {
    tasks.push({
      id: 'cloze-practice',
      title: '本周模拟考可用',
      desc: `已积累 ${yellowCount} 个黄灯词`,
      icon: FileText,
      color: 'purple',
      badge: '每周一次',
      badgeVariant: 'purple',
      action: () => navigate('/cloze-practice'),
      priority: 4
    });
  }
  
  // 大考资格（低优先级）
  const eligibleForExam = yellowWords.some(w => w.reviewCount >= 5);
  if (eligibleForExam) {
    tasks.push({
      id: 'milestone-exam',
      title: '里程碑大考已解锁',
      desc: '有单词达到大考标准',
      icon: Trophy,
      color: 'yellow',
      badge: '绿灯冲刺',
      badgeVariant: 'yellow',
      action: () => navigate('/milestone'),
      priority: 5
    });
  }
  
  // 空状态
  if (tasks.length === 0) {
    return (
      <Card variant="glass" padding="lg" className="today-tasks today-tasks--empty">
        <div className="today-tasks__empty">
          <Calendar size={48} className="today-tasks__empty-icon" />
          <h3 className="today-tasks__empty-title">太棒了！</h3>
          <p className="today-tasks__empty-desc">
            暂无待复习单词，继续保持 💪
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card variant="glass" padding="lg" className="today-tasks">
      <div className="today-tasks__header">
        <div className="today-tasks__header-left">
          <Calendar size={24} />
          <h3 className="today-tasks__title">🎯 今日待办</h3>
        </div>
        <Badge variant="blue" size="sm">
          {tasks.length} 个任务
        </Badge>
      </div>
      
      <div className="today-tasks__list">
        {tasks.map((task) => {
          const IconComponent = task.icon;
          return (
            <div 
              key={task.id} 
              className={`today-task-item today-task-item--${task.color}`}
              onClick={task.action}
            >
              <div className="today-task-icon">
                <IconComponent size={24} />
              </div>
              <div className="today-task-content">
                <div className="today-task-header">
                  <h4 className="today-task-title">{task.title}</h4>
                  <Badge variant={task.badgeVariant} size="xs">{task.badge}</Badge>
                </div>
                <p className="today-task-desc">{task.desc}</p>
              </div>
              <ChevronRight size={20} className="today-task-arrow" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TodayTasks;
