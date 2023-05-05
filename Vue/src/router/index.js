import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    meta: { title: 'Main' },
    redirect: '/home',
    component: () => import('@/view/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: 'Home' },
        component: () => import('@/components/Dashboard/Dashboard.vue'),
        children: [
          {
            path: '/level21',
            name: 'level21',
            meta: { title: 'Level 21' },
            component: () => import('@/components/Dashboard/Dashboard.vue'),
            children: [
              {
                path: '/level211',
                name: 'level211',
                meta: { title: 'Level 211' },
                component: () => import('@/components/Dashboard/Dashboard.vue'),
                children: [],
              },
              {
                path: '/level212',
                name: 'level212',
                meta: { title: 'Level 212' },
                component: () => import('@/components/Dashboard/Dashboard.vue'),
                children: [],
              },
              {
                path: '/level213',
                name: 'level213',
                meta: { title: 'Level 23' },
                component: () => import('@/components/Dashboard/Dashboard.vue'),
                children: [],
              },
            ],
          },
          {
            path: '/level22',
            name: 'level22',
            meta: { title: 'Level 22' },
            component: () => import('@/components/Dashboard/Dashboard.vue'),
            children: [],
          },
          {
            path: '/level23',
            name: 'level23',
            meta: { title: 'Level 23' },
            component: () => import('@/components/Dashboard/Dashboard.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/activities',
        name: 'activities',
        meta: { title: 'Side Activity' },
        redirect: '/activities/list-activities',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/activities/list-activities',
            name: 'list-activities',
            meta: { title: 'List activities' },
            component: () => import('@/components/SideActivities/ActivitiesList.vue'),
          },
          {
            path: '/activities/report-activities',
            name: 'list-activities',
            meta: { title: 'List activities' },
            component: () => import('@/components/SideActivities/ActivityReport.vue'),
          },
          {
            path: '/activities/create',
            name: 'create-activity',
            meta: { title: 'Create Activity' },
            component: () => import('@/components/SideActivities/FormActivity.vue'),
          },
          {
            path: '/activities/register-list',
            name: 'register-list',
            meta: { title: 'Register list' },
            component: () => import('@/components/SideActivities/ActivitiesRegister.vue'),
          },
          {
            path: '/activities/note-list',
            name: 'note-list',
            meta: { title: 'Note list' },
            component: () => import('@/components/SideActivities/ActivitiesNote.vue'),
          },
          {
            path: '/activities/activity-detail',
            name: 'activity-detail',
            meta: { title: ' Activity Detail' },
            component: () => import('@/components/SideActivities/ViewDetail.vue'),
          },
        ],
      },
      {
        path: '/libraries',
        name: 'libraries',
        meta: { title: 'Reference Library' },
        redirect: '/libraries/student-library',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/libraries/student-library',
            name: 'student-library',
            meta: { title: 'Student library' },
            component: () => import('@/components/Libraries/StudentLibrary.vue'),
          },
          {
            path: '/libraries/teacher-library',
            name: 'teacher-library',
            meta: { title: 'Teacher library' },
            component: () => import('@/components/Libraries/TeacherLibrary.vue'),
          },
          {
            path: '/libraries/internal-library',
            name: 'internal-library',
            meta: { title: 'Internal Library' },
            component: () => import('@/components/Libraries/InternalLibrary.vue'),
          },
          {
            path: '/libraries/add-reference',
            name: 'add-reference',
            meta: { title: 'Add Reference' },
            component: () => import('@/components/Libraries/AddReference.vue'),
          },
          {
            path: '/libraries/edit-reference',
            name: 'edit-reference',
            meta: { title: 'Edit Reference' },
            component: () => import('@/components/Libraries/EditReference.vue'),
          },
          {
            path: '/libraries/view-reference',
            name: 'view-reference',
            meta: { title: 'View Reference' },
            component: () => import('@/components/Libraries/ViewReference.vue'),
          },
        ],
      },

      {
        path: '/check-your-email',
        name: 'check-your-email',
        meta: { title: 'Check Your Email - CEC App' },
        component: () => import('@/view/CheckYourEmail.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: 'Dashboard' },
        component: () => import('@/components/Home/Overview.vue'),
        children: [],
      },
      {
        path: '/student-monthly-comment',
        name: 'student-monthly-comment',
        meta: { title: 'Monthly comment' },
        component: () => import('@/components/MonthCommentStudent/Overview.vue'),
        children: [],
      },

      {
        path: '/record-by-stu',
        name: 'record-by-stu',
        meta: { title: 'Record' },
        component: () => import('@/components/RecordingByStudent/Overview.vue'),
        children: [],
      },

      {
        path: '/no-home-work',
        name: 'no-home-work',
        meta: { title: 'No Home Work' },
        component: () => import('@/components/Report/NoHomeWork/Overview.vue'),
        children: [],
      },
      {
        path: '/reward',
        name: 'reward',
        meta: { title: 'Reward' },
        component: () => import('@/components/Report/AchievementReward/Overview.vue'),
        children: [],
      },
      {
        path: '/reward-student',
        name: 'reward-student',
        meta: { title: 'Reward Student' },
        component: () => import('@/components/RewardByStudent/Overview.vue'),
        children: [],
      },
      {
        path: '/makeup-lesson',
        name: 'makeup-lesson',
        meta: { title: 'Make up lesson' },
        component: () => import('@/components/ClassManagement/MakeupLesson/Overview.vue'),
        children: [],
      },
      {
        path: '/telesales',
        name: 'telesales',
        meta: { title: 'Telesales' },
        component: () => import('@/components/Report/Telesales/Overview.vue'),
        children: [],
      },

      {
        path: '/view-detail-news/:newsID',
        name: 'view-detail-news',
        meta: { title: 'View Detail News' },
        component: () => import('@/components/Dashboard/ViewDetailNews.vue'),
        children: [],
      },

      {
        path: '/my-profile',
        name: 'my-profile',
        meta: { title: 'My Profile' },
        component: () => import('@/components/MyProfile/MyProfile.vue'),
        children: [],
      },
      {
        path: '/version',
        name: 'version-view',
        meta: { title: 'Version' },
        component: () => import('@/components/ListVersion/ListVersion.vue'),
        children: [],
      },

      {
        path: '/room',
        name: 'room',
        meta: { title: 'Task Management' },
        redirect: '/room/calendar',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/room/calendar',
            name: 'room-calendar',
            meta: { title: 'Room calendar' },
            component: () => import('@/components/ClassManagement/Room.vue'),
          },
          {
            path: '/task-management/create-task',
            name: 'create-task',
            meta: { title: 'Task Management Create Task' },
            component: () => import('@/components/TaskManagement/FormTask.vue'),
          },
          {
            path: '/task-management/update-task/:taskID',
            name: 'update-task',
            meta: { title: 'Task Management Create Task' },
            component: () => import('@/components/TaskManagement/FormTask.vue'),
          },
        ],
      },
      {
        path: '/task-management',
        name: 'task-management',
        meta: { title: 'Task Management' },
        redirect: '/task-management',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/task-management/overview',
            name: 'task-management-calendar',
            meta: { title: 'Task Management Calendar' },
            component: () => import('@/components/TaskManagement/Overview.vue'),
          },
          {
            path: '/task-management/create-task',
            name: 'create-task',
            meta: { title: 'Task Management Create Task' },
            component: () => import('@/components/TaskManagement/FormTask.vue'),
          },
          {
            path: '/task-management/update-task/:taskID',
            name: 'update-task',
            meta: { title: 'Task Management Create Task' },
            component: () => import('@/components/TaskManagement/FormTask.vue'),
          },
        ],
      },
      {
        path: '/my-profile',
        name: 'my-profile',
        meta: { title: 'My Profile' },
        component: () => import('@/components/MyProfile/MyProfile.vue'),
        children: [],
      },
      {
        path: '/my-profile/edit/:userId',
        name: 'my-profile-edit',
        meta: { title: 'My Profile - Edit' },
        component: () => import('@/components/MyProfile/Edit.vue'),
        children: [],
      },
      {
        path: '/test-result/form',
        name: 'test-result-form',
        meta: { title: 'Test Result Form' },
        component: () => import('@/components/ClassManagement/FormTestResult.vue'),
        children: [],
      },
      {
        path: '/my-profile/change-password',
        name: 'my-profile-change-password',
        meta: { title: 'My Profile - Change Password' },
        component: () => import('@/components/MyProfile/ChangePassword.vue'),
        children: [],
      },
      {
        path: '/my-profile/reset-password',
        name: 'my-profile-reset-password',
        meta: { title: 'My Profile - Reset Password' },
        component: () => import('@/components/MyProfile/ResetPassword.vue'),
        children: [],
      },
      {
        path: '/center-management',
        name: 'center-management',
        meta: { title: 'Center Management' },
        redirect: '/center-management/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/center-management/overview',
            name: 'center-management-overview',
            meta: { title: 'Center Management - Overview' },
            component: () => import('@/components/CenterManagement/OverView.vue'),
            children: [],
          },
          {
            path: '/center-management/detail/:centerId',
            name: 'center-management-detail',
            meta: { title: 'Center Management - Detail' },
            component: () => import('@/components/CenterManagement/Detail.vue'),
            children: [],
          },
          {
            path: '/center-management/add-new-account',
            name: 'center-management-add-new-account',
            meta: { title: 'Center Management - Add New Account' },
            component: () => import('@/components/CenterManagement/AddNewAccount.vue'),
            children: [],
          },
          {
            path: '/center-management/user/:userId',
            name: 'center-management-user-detail',
            meta: { title: 'Center Management - User Detail' },
            component: () => import('@/components/CenterManagement/DetailUser.vue'),
            children: [],
          },
          {
            path: '/center-management/application',
            name: 'center-management-application',
            meta: { title: 'Center Management - Application' },
            component: () => import('@/components/CenterManagement/Application.vue'),
            children: [],
          },
          {
            path: '/center-management/time-available',
            name: 'center-management-time-available',
            meta: { title: 'Center Management - Time Available' },
            component: () => import('@/components/CenterManagement/TimeAvailable.vue'),
            children: [],
          },
          {
            path: '/center-management/view-detail-time-available/:recordId',
            name: 'center-management-view-detail-time-available',
            meta: { title: 'Center Management - View Detail Time Available' },
            component: () => import('@/components/CenterManagement/ViewDetailTimeAvailable.vue'),
            children: [],
          },
          {
            path: '/center-management/view-schedule/:teacherId',
            name: 'center-management-view-schedule',
            meta: { title: 'Center Management - View Schedule' },
            component: () => import('@/components/CenterManagement/ViewSchedule.vue'),
            children: [],
          },
          {
            path: '/center-management/view-news',
            name: 'center-management-view-news',
            meta: { title: 'Center Management - View new' },
            component: () => import('@/components/CenterManagement/OverviewNew.vue'),
            children: [],
          },
          {
            path: '/center-management/create-news',
            name: 'center-management-creat-news',
            meta: { title: 'Center Management - Create new' },
            component: () => import('@/components/CenterManagement/CreateNews.vue'),
            children: [],
          },
          {
            path: '/center-management/edit-news-public/:newsID&:pageIndex&:pageSize',
            name: 'center-management-edit-news-public',
            meta: { title: 'Center Management - Edit new public' },
            component: () => import('@/components/CenterManagement/EditNewPublic.vue'),
            children: [],
          },
          {
            path: '/center-management/edit-news-draft/:newsID&:pageIndex&:pageSize',
            name: 'center-management-edit-news-draft',
            meta: { title: 'Center Management - Edit new draft' },
            component: () => import('@/components/CenterManagement/EditNewDraft.vue'),
            children: [],
          },
          {
            path: '/center-management/view-news-management/:newsID&:pageIndex&:pageSize',
            name: 'center-management-view-news-management',
            meta: { title: 'Center Management - View new' },
            component: () => import('@/components/CenterManagement/ViewNew.vue'),
            children: [],
          },
          {
            path: '/center-management/feedback-management/:fromDate&:toDate',
            name: 'center-management-feedback',
            meta: { title: 'Center Management - Feed back' },
            component: () =>
              import('@/components/CenterManagement/FeedBackManagement/OverviewFeedBack.vue'),
            children: [],
          },
          {
            path: '/feedback-management-admin',
            name: 'center-management-feedback-admin',
            meta: { title: 'Center Management - Feed back - Admin' },
            component: () =>
              import(
                '@/components/CenterManagement/FeedBackManagement/OverviewFeedBackByAdmin.vue'
              ),
            children: [],
          },
          {
            path: '/center-management/feedback-management-messenger/create-feedback',
            name: 'create-feedback',
            meta: { title: 'Center Management - Feed back' },
            component: () =>
              import('@/components/CenterManagement/FeedBackManagement/CreateFeedBack.vue'),
            children: [],
          },
          {
            path: '/feedback-management-messenger',
            name: 'center-management-feedback-messenger',
            meta: { title: 'Messenger' },
            component: () =>
              import('@/components/CenterManagement/FeedBackManagement/FeedBackMessenger.vue'),
            children: [],
          },
          {
            path: '/feedback-management-messenger-admin',
            name: 'center-management-feedback-messenger-admin',
            meta: { title: 'Messenger' },
            component: () =>
              import(
                '@/components/CenterManagement/FeedBackManagement/FeedBackMessengerByAdmin.vue'
              ),
            children: [],
          },
          {
            path: '/center-management/view-feedback-management/:feedBackID&:fromDate&:toDate',
            name: 'feedback-management-view-detail',
            meta: { title: 'Center Management - View feedback' },
            component: () =>
              import('@/components/CenterManagement/FeedBackManagement/ViewDetailFeedBack.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/account-management',
        name: 'account-management',
        meta: { title: 'Account Management' },
        redirect: '/account-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/account-management/overview',
            name: 'account-management-overview',
            meta: { title: 'Account Management - Over View' },
            component: () => import('@/components/AccountManagement/OverView.vue'),
            children: [],
          },
          {
            path: '/account-management/add-new',
            name: 'account-management-add-new',
            meta: { title: 'Account Management - Add New' },
            component: () => import('@/components/AccountManagement/AddNew.vue'),
            children: [],
          },
          {
            path: '/account-management/add-account-to-center',
            name: 'account-management-add-account-to-center',
            meta: { title: 'Account Management - Add Account To Center' },
            component: () => import('@/components/AccountManagement/AddAccountToCenter.vue'),
            children: [],
          },
          {
            path: '/account-management/view-account/:userId',
            name: 'account-management-view-account',
            meta: { title: 'Account Management - View Account' },
            component: () => import('@/components/AccountManagement/ViewAccount.vue'),
            children: [],
          },

          {
            path: '/account-management/reset-password',
            name: 'account-management-reset-password',
            meta: { title: 'My Profile - Reset Password' },
            component: () => import('@/components/AccountManagement/ResetPassword.vue'),
            children: [],
          },
          {
            path: '/account-management/update-account/:userId',
            name: 'account-management-update-account',
            meta: { title: 'Account Management - Update Account' },
            component: () => import('@/components/AccountManagement/UpdateAccount.vue'),
            children: [],
          },
          {
            path: '/account-management/view-teacher-calendar/:teacherId',
            name: 'account-management-view-teacher-calendar',
            meta: { title: 'Account Management - View Teacher Calendar' },
            component: () => import('@/components/AccountManagement/ViewTeacherCalendar.vue'),
            children: [],
          },
          {
            path: '/account-management/view-teacher-free-time/:teacherId',
            name: 'account-management-view-teacher-free-time',
            meta: { title: 'Account Management - View Teacher Free Time' },
            component: () => import('@/components/AccountManagement/ViewTeacherFreeTime.vue'),
            children: [],
          },
          {
            path: '/account-management/view-teacher-leave-of-absence/:teacherId',
            name: 'account-management-view-teacher-leave-of-absence',
            meta: {
              title: 'Account Management - View Teacher Leave Of Absence',
            },
            component: () => import('@/components/AccountManagement/ViewTeacherLeaveOfAbsence.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/course-management',
        name: 'course-management',
        meta: { title: 'Course Management' },
        redirect: '/course-management/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/course-management/overview',
            name: 'course-management-overview',
            meta: { title: 'Course Management - Overview' },
            component: () => import('@/components/CourseManagement/OverView.vue'),
            children: [],
          },
          {
            path: '/course-management/detail',
            name: 'course-management-detail',
            meta: { title: 'Course Management - Detail' },
            component: () => import('@/components/CourseManagement/Detail.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/class-management',
        name: 'class-management',
        meta: { title: 'Class Management' },
        redirect: '/class-management/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/class-management/qc-daily-class',
            name: 'qc-daily-class',
            meta: { title: 'qc-daily-class' },
            component: () => import('@/components/ClassManagement/DailyClasses.vue'),
            children: [],
          },
          {
            path: '/class-management/overview',
            name: 'class-management-overview',
            meta: { title: 'Class Management - Overview' },
            component: () => import('@/components/ClassManagement/ClassManagement.vue'),
            children: [],
          },
          {
            path: '/class-management/detail',
            name: 'class-management-detail',
            meta: { title: 'Class Management - Detail' },
            component: () => import('@/components/ClassManagement/ClassDetail.vue'),
            children: [],
          },
          {
            path: '/class-management/add-new',
            name: 'class-management-add-new',
            meta: { title: 'Class Management - Add new' },
            component: () => import('@/components/ClassManagement/AddNewClass.vue'),
            children: [],
          },
          {
            path: '/class-management/edit/:classID',
            name: 'class-management-edit',
            meta: { title: 'Class Management - Edit class' },
            component: () => import('@/components/ClassManagement/Edit.vue'),
            children: [],
          },
          {
            path: '/class-management/view-student-attendance',
            name: 'class-management-view-student-attendance',
            meta: { title: 'Class Management - View Student Attendance' },
            component: () => import('@/components/ClassManagement/ViewStudentAttendance.vue'),
          },
          {
            path: '/class-management/take-attendance-student',
            name: 'class-management-take-attendance-student',
            meta: { title: 'Class Management - Take Attendance Student' },
            component: () => import('@/components/ClassManagement/TakeAttendanceStudent.vue'),
          },
          {
            path: '/class-management/lesson-notes',
            name: 'class-management-lesson-notes',
            meta: { title: 'Class Management - Lesson Notes' },
            component: () => import('@/components/ClassManagement/LessonNotes.vue'),
          },
          {
            path: '/class-management/daily-classes',
            name: 'class-management-daily-classes',
            meta: { title: 'Class Management - Daily Classes' },
            component: () => import('@/components/ClassManagement/DailyClasses.vue'),
            children: [],
          },
          {
            path: '/class-management/calendar',
            name: 'class-management-calendar',
            meta: { title: 'Class Management - Calendar' },
            component: () => import('@/components/ClassManagement/Calendar.vue'),
            children: [],
          },
          {
            path: '/class-management/create-lesson-report',
            name: 'class-management-create-lesson-report',
            meta: { title: 'Class Management - Create Lesson Report' },
            component: () => import('@/components/ClassManagement/CreateLessonReport.vue'),
            children: [],
          },
          {
            path: '/class-management/view-lesson-report',
            name: 'class-management-view-lesson-report',
            meta: { title: 'Class Management - View Lesson Report' },
            component: () => import('@/components/ClassManagement/ViewLessonReport.vue'),
            children: [],
          },
          {
            path: '/class-management/edit-lesson-report',
            name: 'class-management-edit-lesson-report',
            meta: { title: 'Class Management - Edit Lesson Report' },
            component: () => import('@/components/ClassManagement/EditLessonReport.vue'),
            children: [],
          },
          {
            path: '/class-management/month-student-comments',
            name: 'month-student-comments',
            meta: { title: 'Statistics' },
            component: () =>
              import('@/components/StatisticManagement/MonthlyStudentComment/Overview.vue'),
            children: [],
          },
          {
            path: '/class-management/student-recording',
            name: 'student-recording',
            meta: { title: 'Student Recording' },
            component: () =>
              import('@/components/ClassManagement/StudentRecording/Overview.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/my-calendar',
        name: 'my-calendar',
        meta: { title: 'My Calendar' },
        redirect: '/my-calendar/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/my-calendar/overview',
            name: 'my-calendar-overview',
            meta: { title: 'My Calendar - Overview' },
            component: () => import('@/components/Calendar/MyCalendar.vue'),
          },
          {
            path: '/my-calendar/leave-of-absence-history',
            name: 'my-calendar-leave-of-absence-history',
            meta: { title: 'My Calendar - leave of absence history' },
            component: () => import('@/components/Calendar/LeaveOfAbsenceHistory.vue'),
          },
          {
            path: '/my-calendar/register-the-absence',
            name: 'my-calendar-register-the-absence',
            meta: { title: 'My Calendar - register the absence' },
            component: () => import('@/components/Calendar/RegisterTheAbsence.vue'),
          },
          {
            path: '/my-calendar/edit-the-absence/:recordID',
            name: 'my-calendar-edit-the-absence',
            meta: { title: 'My Calendar - Edit the absence' },
            component: () => import('@/components/Calendar/EditTheAbsence.vue'),
          },
          {
            path: '/my-calendar/register-free-time',
            name: 'my-calendar-register-free-time',
            meta: { title: 'My Calendar - Register Free Time' },
            component: () => import('@/components/Calendar/RegisterFreeTime.vue'),
          },
          {
            path: '/my-calendar/student-attendance',
            name: 'my-calendar-student-attendance',
            meta: { title: 'My Calendar - Student Attendance' },
            component: () => import('@/components/Calendar/StudentAttendance.vue'),
          },
          {
            path: '/my-calendar/class-name',
            name: 'my-calendar-class-name',
            meta: { title: 'My Calendar - Class name' },
            component: () => import('@/components/Calendar/ClassName.vue'),
            children: [],
          },
          {
            path: '/my-calendar/class-name/view-lesson-detail',
            name: 'my-calendar-class-name-view-lesson-detail',
            meta: { title: 'My Calendar - Lesson Detail' },
            component: () => import('@/components/Calendar/ViewLessonDetail.vue'),
            children: [],
          },
          {
            path: '/my-calendar/daily-classes',
            name: 'my-calendar-daily-classes',
            meta: { title: 'My Calendar - Daily Classes' },
            component: () => import('@/components/Calendar/DailyClasses.vue'),
            children: [],
          },
          {
            path: '/my-calendar/view-class-detail',
            name: 'my-calendar-class-detail',
            meta: { title: 'My Calendar - Class Detail' },
            component: () => import('@/components/Calendar/ClassDetail.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/Salary',
        name: 'salary',
        meta: { title: 'Salary' },
        redirect: '/salary/teaher-salary',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/salary/list',
            name: 'salary-list',
            meta: { title: 'Salary' },
            component: () => import('@/components/SalaryTeacher/Salary.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/Financial',
        name: 'financial',
        meta: { title: 'Financial' },
        redirect: '/financial/teacher-salary',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/financial/teacher-salary',
            name: 'financial-teacher-salary',
            meta: { title: 'Financial' },
            component: () => import('@/components/FinancialManagement/TeacherSalary.vue'),
            children: [],
          },
          {
            path: '/financial/qc-salary',
            name: 'financial-qc-salary',
            meta: { title: 'Financial' },
            component: () => import('@/components/FinancialManagement/QCSalary.vue'),
            children: [],
          },
          {
            path: '/financial/detail-teacher-salary/:teacherId',
            name: 'financial-detail-teacher-salary',
            meta: { title: 'Financial' },
            component: () => import('@/components/FinancialManagement/ViewDetailTeacherSalary.vue'),
            children: [],
          },
          {
            path: '/financial/detail-qc-salary/:isMy',
            name: 'financial-detail-qc-salary',
            meta: { title: 'Financial' },
            component: () => import('@/components/FinancialManagement/ViewDetailQcSalary.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/statistics',
        name: 'statistics',
        meta: { title: 'Statistics' },
        redirect: '/statistics/list',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/statistics/student-by-class',
            name: 'statistics-student-by-class',
            meta: { title: 'Statistics' },
            component: () => import('@/components/StatisticManagement/StudentByClassList.vue'),
            children: [],
          },

          {
            path: '/statistics/student-absent-report',
            name: 'student-absent-Report',
            meta: { title: 'Statistics' },
            component: () => import('@/components/StatisticManagement/StudentAbsentReport.vue'),
            children: [],
          },
          {
            path: '/statistics/student-attendance',
            name: 'statistics-student-attendance',
            meta: { title: 'Statistics' },
            component: () => import('@/components/StatisticManagement/StudentAttendance.vue'),
            children: [],
          },
          {
            path: '/statistics/teacher-on-leave',
            name: 'statistics-teacher-on-leave',
            meta: { title: 'Statistics' },
            component: () => import('@/components/StatisticManagement/TeacherOnLeave.vue'),
            children: [],
          },
          {
            path: '/statistics/staff-on-leave',
            name: 'statistics-staff-on-leave',
            meta: { title: 'Statistics' },
            component: () => import('@/components/StatisticManagement/StaffOnLeave.vue'),
            children: [],
          },
          {
            path: '/statistics/teacher-changes-by-class',
            name: 'statistics-teacher-changes-by-class',
            meta: { title: 'Statistics' },
            component: () => import('@/components/StatisticManagement/TeacherChangesByClass.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/application',
        name: 'application',
        meta: { title: 'Application' },
        redirect: '/application/list',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/application/leave-of-absence-request',
            name: 'application-leave-of-absence-request',
            meta: { title: 'Application' },
            component: () => import('@/components/ApplicationManagement/LeaveOfAbsenceRequest.vue'),
            children: [],
          },
          {
            path: '/application/edit-staff-absence-request/:leaveOfAbsenceID',
            name: 'application-edit-staff-absence-request',
            meta: { title: 'Application' },
            component: () => import('@/components/ApplicationManagement/EditStaffAbsence.vue'),
            children: [],
          },
          {
            path: '/application/request-leave-absence',
            name: 'application-leave-absence',
            meta: { title: 'application' },
            component: () => import('@/components/ApplicationManagement/RequestLeaveAbsence.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/request',
        name: 'request',
        meta: { title: 'Request' },
        redirect: '/request/list',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/request/teacher-leave-of-absence-request',
            name: 'teacher-leave-of-absence-request',
            meta: {
              title: 'Request - Leave of absence request list',
            },
            component: () => import('@/components/RequestManagement/Teacher/LeaveOfAbsence.vue'),
            children: [],
          },
          {
            path: '/request/teacher-leave-absence-request-detail/:teacherID&:fromTime&:toTime&:recordID',
            name: 'teacher-leave-absence-request-detail',
            meta: {
              title: 'Request - Leave of absence request detail',
            },
            component: () =>
              import('@/components/RequestManagement/Teacher/LeaveRequestDetail.vue'),
            children: [],
          },
          {
            path: '/request/staff-leave-of-absence-request',
            name: 'staff-leave-of-absence-request',
            meta: { title: 'Request - Leave of absence request list' },
            component: () => import('@/components/RequestManagement/Staff/LeaveOfAbsence.vue'),
            children: [],
          },
          {
            path: '/request/staff-leave-absence-request-detail/:recordID',
            name: 'staff-leave-absence-request-detail',
            meta: {
              title: 'Request - Leave of absence request detail',
            },
            component: () => import('@/components/RequestManagement/Staff/LeaveRequestDetail.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/report/placement-test-student-report',
        name: 'pts-report',
        meta: { title: 'Report - PT Student' },
        component: () => import('@/components/Report/PTReport/PTReport.vue'),
        children: [],
      },
      {
        path: '/report/registration-statement-report',
        name: 'regis-state-report',
        meta: { title: 'Report - Registration statement' },
        component: () => import('@/components/Report/RegisStateReport/RegisStateReport.vue'),
        children: [],
      },
      {
        path: '/report',
        name: 'report',
        meta: { title: 'Report' },
        redirect: '/report/list',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/report/revenue-report',
            name: 'revenue-report',
            meta: { title: 'Report' },
            component: () => import('@/components/Report/Revenue/Overview.vue'),
            children: [],
          },
          {
            path: '/report/sale-report',
            name: 'sale-report',
            meta: { title: 'Report' },
            component: () => import('@/components/Report/SaleReport/Overview.vue'),
            children: [],
          },
          {
            path: '/report/visitor',
            name: 'visitor-report',
            meta: { title: 'Report' },
            component: () => import('@/components/Report/VisitorReport/Overview.vue'),
            children: [],
          },
          {
            path: '/report/custoner-care',
            name: 'custoner-care',
            meta: { title: 'Report' },
            component: () => import('@/components/Report/CustomerCare/Overview.vue'),
            children: [],
          },
          {
            path: '/report/outstanding-report',
            name: 'report-outstanding-report',
            meta: { title: 'Report' },
            component: () => import('@/components/Report/Outstanding/Overview.vue'),
            children: [],
          },
          {
            path: '/report/book-inventory',
            name: 'book-inventory',
            meta: { title: 'bookInventory' },
            component: () => import('@/components/Report/BookInventory/OverView.vue'),
            children: [],
          },
          {
            path: '/report/student-attendance',
            name: 'report-student-attendance',
            meta: { title: 'Report' },
            component: () => import('@/components/Report/AttendanceReport.vue'),
            children: [],
          },
          {
            path: '/report/student-homework',
            name: 'report-student-homework',
            meta: { title: 'Report' },
            component: () => import('@/components/Report/HomeworkReport.vue'),
            children: [],
          },
          {
            path: '/report/student-av-report',
            name: 'student-av-report',
            meta: { title: 'Student Average Report' },
            component: () => import('@/components/StudentAverageReport/StudentAverageReport.vue'),
          },
          {
            path: '/report/StoppedStudent',
            name: 'StoppedStudent',
            meta: {
              title: 'StoppedStudent',
            },
            component: () => import('@/components/StoppedStudent/StoppedStudent.vue'),
            children: [],
          },
          {
            path: '/report/kpi',
            name: 'KPI',
            meta: {
              title: 'KPI',
            },
            component: () => import('@/components/Report/KPI/KPI-report.vue'),
            children: [],
          },
          {
            path: '/report/courseOverview',
            name: 'courseOverview',
            meta: {
              title: 'courseOverview',
            },
            component: () => import('@/components/Report/CourseOverviews/CourseOverviews.vue'),
            children: [],
          },
          {
            path: '/report/RevenueReport',
            name: 'Revenue Report',
            meta: {
              title: 'Revenue Report',
            },
            component: () => import('@/components/Report/RevenueReport.vue'),
            children: [],
          },
          {
            path: '/report/daily-spending-diary',
            name: 'report-daily-spending-diary',
            meta: { title: 'Daily Spending Diary' },
            component: () => import('@/components/Report/SpendingDiary/SpendingDiary.vue'),
            children: [],
          },
          {
            path: '/report/RevenueReport/staff/:id/:year/:name',
            name: 'Revenue staff',
            meta: {
              title: 'Revenue staff',
            },
            component: () => import('@/components/Report/RevenueStaff.vue'),
            children: [],
          },
          {
            path: '/report/daily-cash',
            name: 'report-daily-cash',
            meta: { title: 'Daily Cash' },
            component: () => import('@/components/Report/DailyCash/DailyCash.vue'),
            children: [],
          },
        ],
      },
      // Student
      {
        path: '/student-calendar',
        name: 'student-calendar',
        meta: { title: 'My Calendar' },
        redirect: '/student-calendar/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/student-calendar/overview',
            name: 'student-calendar-overview',
            meta: { title: 'My Calendar - Overview' },
            component: () => import('@/components/StudentCalendar/MyCalendar.vue'),
          },
          {
            path: '/student-calendar/class-detail',
            name: 'student-calendar-class-detail',
            meta: { title: 'My Calendar - Class Detail' },
            component: () => import('@/components/StudentCalendar/ClassDetail.vue'),
          },
        ],
      },
      {
        path: '/student-roadmap',
        name: 'student-roadmap',
        meta: { title: 'My Roadmap' },
        redirect: '/student-roadmap/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/student-roadmap/overview',
            name: 'student-roadmap-overview',
            meta: { title: 'My Roadmap - Overview' },
            component: () => import('@/components/Roadmap/Roadmap.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/',
    name: 'chatting',
    meta: { title: 'Chatting' },
    redirect: '/chatting',
    component: () => import('@/view/Chatting.vue'),
    children: [
      {
        path: '/chat',
        name: 'chat',
        meta: { title: 'Chat' },
        component: () => import('@/components/ChatBox/Chat.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'Login - CEC App' },
    component: () => import('@/view/Login.vue'),
  },
  {
    path: '/change-password',
    name: 'change-password',
    meta: { title: 'Change Password - CEC App' },
    component: () => import('@/view/ChangePassword.vue'),
  },
  {
    path: '/choose-center',
    name: 'choose-center',
    meta: { title: 'Choose Center - CEC App' },
    component: () => import('@/view/ChooseCenter.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    meta: { title: 'Sign Up - CEC App' },
    component: () => import('@/view/SignUp.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    meta: { title: 'Forgot Password - CEC App' },
    component: () => import('@/view/ForgotPassword.vue'),
  },

  {
    path: '/reset-password',
    name: 'reset-password',
    meta: { title: 'Reset Password - CEC App' },
    component: () => import('@/view/ResetPassword.vue'),
  },
  {
    path: '/not-found',
    name: 'not-found',
    meta: { title: 'Not Found - CEC App' },
    component: () => import('@/components/Error/NotFound.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

const DEFAULT_TITLE = 'CEC'
router.beforeEach((to, from, next) => {
  Vue.nextTick(() => {
    document.title = DEFAULT_TITLE
  })

  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}

  if (
    authRequired &&
    (!currentUser || !currentUser.token) &&
    to.name !== 'login' &&
    to.name !== 'forgot-password' &&
    to.name !== 'reset-password'
  ) {
    next({ name: 'login' })
  } else {
    next()
  }

  if (
    currentUser.userInfo &&
    currentUser.userInfo.accountTypeName === 'Teacher' &&
    to.name === 'center-management-creat-news'
  ) {
    next({ name: 'home' })
  }
})
