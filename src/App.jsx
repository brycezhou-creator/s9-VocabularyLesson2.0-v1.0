import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './apps/demo/Home';
import StudentApp from './apps/student/StudentApp';
import TeacherApp from './apps/teacher/TeacherApp';
import DemoView from './apps/demo/DemoView';
import ViewSwitcher from './shared/components/ui/ViewSwitcher';
// 新增模块页面（同事负责）
import SmartReview from './apps/demo/pages/SmartReview';
import AIContext from './apps/demo/pages/AIContext';
import MilestoneExam from './apps/demo/pages/MilestoneExam';
// 增值服务 - AI语境闭环
import StoryReading from './apps/demo/pages/StoryReading';
import ClozePractice from './apps/demo/pages/ClozePractice';
import LearningReport from './apps/demo/pages/LearningReport';

function App() {
  const location = useLocation();
  const showViewSwitcher = location.pathname !== '/' && 
                           !location.pathname.startsWith('/smart-review') &&
                           !location.pathname.startsWith('/ai-context') &&
                           !location.pathname.startsWith('/milestone') &&
                           !location.pathname.startsWith('/story-reading') &&
                           !location.pathname.startsWith('/cloze-practice') &&
                           !location.pathname.startsWith('/learning-report');

  return (
    <>
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<Home />} />
        
        {/* Model A/B 课堂（你负责） */}
        <Route path="/student" element={<StudentApp />} />
        <Route path="/teacher" element={<TeacherApp />} />
        <Route path="/demo" element={<DemoView />} />
        
        {/* 额外模块页面（同事负责） */}
        <Route path="/smart-review" element={<SmartReview />} />
        <Route path="/ai-context" element={<AIContext />} />
        <Route path="/milestone" element={<MilestoneExam />} />
        
        {/* 增值服务 - AI语境闭环 */}
        <Route path="/story-reading" element={<StoryReading />} />
        <Route path="/cloze-practice" element={<ClozePractice />} />
        
        {/* 学习报告 */}
        <Route path="/learning-report" element={<LearningReport />} />
      </Routes>
      {showViewSwitcher && <ViewSwitcher />}
    </>
  );
}

export default App;
