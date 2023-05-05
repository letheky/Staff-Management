export const ROOT = process.env.VUE_APP_URL_API

export const ADMIN_LOGIN = '/api/Users/Login/Users'
export const GET_FUNCTION_OF_ROLE = '/api/getFunctionList/functions/'
export const FORGOT_PASSWORD = '/api/Users/ForgotPassword'
export const USER_RESET_PASSWORD = '/api/Users/ResetPassword'
export const Qc_DAILY_CLASS = '/api/Classes/ClassSchedule/ScheduleInDaysByClassAdmin'

// Account Management
export const GET_ACCOUNT_TYPES = '/api/Users/AccountTypes'
export const GET_USER_LIST = '/api/Users/UserList'
export const DEACTIVE_USER = '/api/Users/Inactive?'
export const UPDATE_AVATAR = '/api/Users/UpdateImage'
export const RESET_PASSWORD = '/api/Users/Admin/changePassword?'

// My Profile
export const GET_DETAIL_USER_INFO = '/api/Users/UserInfo'
export const UPDATE_DETAIL_USER_INFO = '/api/Users/EditUser'
export const CHANGE_PASSWORD = '/api/Users/changePassword?'

// Nationalitiesback
export const GET_COUNTRIES = '/api/Nationalities/Countries'
export const GET_CITIES = '/api/Nationalities/Cities'
export const GET_DISTRICTS = '/api/Nationalities/Districts'
export const GET_DISTRICTS_BY_CITY = '/api/Nationalities/Districts/DistrictByCity'

// Center Management
export const GET_ALL_CENTER = '/api/CenterDetails/Centers'
export const GET_DETAIL_CENTER = '/api/CenterDetails'
export const GET_USER_BY_ROLE = '/api/CenterDetails/UserByRole'
export const GET_LIST_SHIFTS = '/api/Classes/Shifts'
export const LIST_TEACHER_AVAILABLE_TIME = '/api/Teachers/TeacherFreeTime/List'
export const GET_LIST_TEACHER_FREE_TIME =
  '/api/Teachers/TeacherFreeTime/ListTeacherFreeTimenNextDays'

// Course Management
export const GET_DEPARTMENT = '/api/Courses/Department'
export const GET_PROGRAMME = '/api/Courses/Programme/ProgrammeByDepartment'
export const GET_COURSE_BY_DEPARTMENT = '/api/Courses/CoursesbyDepartment'
export const GET_COURSE_BY_PROGRAMME = '/api/Courses/CoursesbyProgramme'
export const GET_COURSE_ALL = '/api/Courses/CourseList'
export const GET_COURSE_DETAIL = '/api/Courses/CourseOverview'
export const GET_DETAIL_COURSE = '/api/Classes/Levels/LevelDetails'

// Class Management
export const GET_LIST_CLASS_STUDENT_STUDING = '/api/Students/ListClassStudying?'
export const GET_CLASS_PROGRAMME = '/api/Classes/Programmes'
export const GET_CLASS_BY_PROGRAMME = '/api/Classes/ClassByProgramme'
export const GET_CLASS_GROUP = '/api/Classes/ClassGroups'
export const GET_CLASS_STATUS = '/api/Classes/ClassStatus'
export const GET_StudentReportOverView = '/api/Reports/OverviewInterSARStudentByClass'
export const SEARCH_CLASS = '/api/Classes/QuickSearchClass'
export const GET_SCHEDULE_IN_DAYS = '/api/Classes/ClassSchedule/ScheduleInDays'
export const GET_TEACHER_SCHEDULE_IN_DAYS = '/api/Classes/ClassSchedule/ScheduleInDaysByUser'
export const GET_CLASS_SHIFT = '/api/Classes/Shifts'
export const GET_CLASS_TYPE = '/api/Classes/ClassTypes'
export const GET_CLASS_ROOM = '/api/Classes/Room'
export const GET_CLASS_OVERVIEW = '/api/Classes/ClassOverview'
export const GET_CLASS_INFO = '/api/Classes/ClassInfo'
export const GET_LIST_STUDENT_ATTENDANCE = '/api/Students/StudentsRegistedBySchedule'
export const VIEW_LIST_STUDENT_ATTENDANCE = '/api/Classes/Attendance/ListAttendances'
export const UPDATE_ATTENDANCE_STUDENT = '/api/Classes/StudentAttendances'
export const LIST_SCHEDULE_OF_CLASS = '/api/Classes/ClassSchedule/Schedule'
export const GET_CLASS_SCHEDULE_DETAIL = '/api/Classes/ClassSchedule/ClassScheduleDetails'
export const ADMIN_GET_LIST_CLASSES_OF_TEACHER = '/api/Classes/Chat/Conferences/Admin'
export const STAFF_GET_LIST_CLASSES_OF_TEACHER = '/api/Classes/Chat/Conferences/ClassAdmin'
export const GET_HUMAN_OF_ONE_CLASS = '/api/Classes/Chat/Conferences/Class'
export const GET_CHAT_INFO = '/api/Classes/Chat/ChatContentsClassAdmin'
export const ADMIN_CHAT = '/api/Classes/Chat/ClassAdmin/ToStudentsAndParents'
export const UPDATE_MESSAGE = '/api/Classes/Chat/Admin/Update'
export const DELETE_MESSAGE = '/api/Classes/Chat/Delete?'
export const CREATE_LESSON_REPORT = '/api/Classes/ClassSchedule/ManageScheduleReports'
export const VIEW_LESSON_REPORT = '/api/Classes/ClassSchedule/ScheduleReports'
export const GET_CLASS_BY_LOCATION = '/api/Classes/ClassByLocation?'
export const CHANGE_STATUS_LESSON_REPORT = '/api/Classes/ClassSchedule/StatusScheduleReports?'
export const SCHEDULE_UPDATE_NOTE = '/api/Classes/ClassSchedule/UpdateNote'
export const STUDENT_RECORDING_BY_ClASSID = '/api/Recording/StudentRecordingByClassID?'
export const RECORD_CATEGORY_BY_CLASS_ID = '/api/Recording/RecordCategoryByClassID?'
export const STUDENT_RECORDING_UPDATE = '/api/Recording/StudentRecording_Update?'
export const STUDENT_RECORD_BU_CLASS_ID = '/api/Recording/StudentRecordingByClassID?'
export const CREATE_RECORD = '/api/Recording/StudentRecording_Add'
export const RECORD_UPDATE_COMMENT = '/api/Recording/comment_Update'
export const RECORD_UPDATE_LINK = '/api/Recording/StudentRecording_Update'
export const CLASS_REG = '/api/Students/ClassRegisted?'
// School
export const GET_LIST_SCHOOL = '/api/Classes/Schools/SchoolsByCity?'

// Counselor
export const GET_LIST_COUNSELOR = '/api/Counselors/CounselorList'

// Record type
export const GET_LIST_RECORD_TYPE = '/api/Students/CustomerGroups'

// Source reference
export const GET_LIST_SOURCE_REFERENCE = '/api/Students/Sources'

// Guardian
export const GET_LIST_GUARDIANS = '/api/Students/Guardians'

// Study purpose
export const GET_LIST_STUDY_PURPOSE = '/api/Students/StudyPurpose'

// User Relative
export const GET_LIST_RELATIVE_TYPES = '/api/Students/RelativeTypes'

// Add user
export const CREATE_ACCOUNT = '/api/Users/AddUser'

// Referral by
export const GET_LIST_REFERRAL_BY = '/api/Users/UserList'

// Teacher information
export const GET_LIST_TEACHER_GROUP = '/api/Teachers/TeacherGroup'
export const GET_LIST_TEACHER_TYPE = '/api/Teachers/TeacherTypes'
export const GET_LIST_TEACHER_RATE = '/api/Teachers/TeachingRates'
export const GET_LIST_TEACHER_SALARYTYPES = '/api/Teachers/TeacherSalaryTypes'
export const GET_LIST_TEACHER_CURRENCY = '/api/Teachers/Currencies'
export const GET_TEACHER_CALENDAR = '/api/Teachers/GetCalendar'
export const GET_QCEC_CALENDAR = '/api/Classes/TeacherSchedule_ByQCEC'
export const REGISTER_FREE_TIME = '/api/Teachers/TeacherFreeTime/Assign'
export const LIST_TEACHER_FREE_TIME = '/api/Teachers/TeacherFreeTime/ListTeacherFreeTime'
export const LIST_FREE_TIME = '/api/Teachers/TeacherFreeTime?'
export const ADD_COVER_TEACHER = '/api/Teachers/ClassSchedule/AssignSubstituteTeacher?'
export const UPDATE_FREE_TIME = '/api/Teachers/TeacherFreeTime/Update'
export const DELETE_FREE_TIME = '/api/Teachers/TeacherFreeTime/Delete?'

// Student information
export const GET_STUDENT_CALENDAR = '/api/Students/StudentSchedule'

// Group List
export const GET_LIST_GROUP_ADMIN = '/api/Users/Group/GroupList'

// Account type
export const GET_LIST_ACCOUNT_TYPE = '/api/Users/AccountTypes'

// Search user
export const GET_USER_SEARCH = '/api/Users/UserSearch?findKey='

// Role
export const UPDATE_ROLE = '/api/Users/Group/UpdateRole?userID='

// View user absence
export const GET_USER_ABSENCE = '/api/Users/UserAbsence?'

// Teacher salary
export const TEACHER_SALARY_LIST = '/api/Teachers/TeacherSalary'

// Teacher salary detail
export const TEACHER_SALARY_DETAIL = '/api/Teachers/TeacherSalarys/TeacherSalaryDetails'

// QC Salary
export const GET_QC_LIST = '/api/Teachers/QCList'
export const GET_QC_SALARY_DETAIL = '/api/Reports/QCSalaryReport'
export const GET_QC_SALARY_DETAIL_WITH_ID_AND_LOCATION = '/api/Reports/QCSalaryReport?'

// Teacher scale
export const TEACHER_SCALE = '/api/Teachers/TeacherScales?'

// List Center
export const GET_LIST_CENTER = '/api/CenterDetails/Centers'

// List Day of week
export const GET_LIST_DAY_OF_WEEK = '/api/Classes/DayOfWeek'

//teacher absence
export const REGISTER_TEACHER_ABSENCE = '/api/Teachers/TeacherAbsence/Assign?'
export const LEAVE_TEACHER_ABSENCE = '/api/Teachers/TeacherAbsence/List?'
export const UPDATE_TEACHER_ABSENCE = '/api/Teachers/TeacherAbsence/Update?'
export const DELETE_TEACHER_ABSENCE = '/api/Teachers/TeacherAbsence/Delete?'

//Admin absence
export const LEAVE_ADMIN_ABSENCE = '/api/Teachers/TeacherAbsence/ListAbsence?'
export const ADMIN_APPROVED_ABSENCE = '/api/Teachers/TeacherAbsence/ApproveOrReject?'

//Staff absence
export const LEAVE_STAFF_ABSENCE =
  '/api/Administration/StaffAbsence/TeacherAbsenceOverviewByTeacher?'
export const VIEW_STAFF_ABSENCE = '/api/Administration/StaffAbsence/TeacherAbsenceOverview?'
export const DELETE_STAFF_ABSENCE = '/api/Administration/StaffAbsence/Delete?'
export const CREATE_STAFF_ABSENCE = '/api/Administration/StaffAbsence/Assign'
export const UPDATE_STAFF_ABSENCE = '/api/Administration/StaffAbsence/Update'
export const APPROVE_OR_REJECT_ABSENCE = '/api/Administration/Absence/ApproveOrReject?'
export const GET_STAFF_BRITHDAY = '/api/Reports/UpComingBirthday?'

//New management
export const NEW_OVERVIEW_MANAGEMENT = '/api/News/Admin/NewsList?'
export const CREATE_NEW_MANAGEMENT = '/api/News/CreateNews'
export const DELETE_NEW_MANAGEMENT = '/api/News/DeleteNews?newsID='
export const UPDATE_NEW_MANAGEMENT = '/api/News/UpdateNews?'
export const UPLOAD_IMAGE = '/api/UploadFile/UrlImage'

// Get all news
export const GET_ALL_NEWS = '/api/News/User/NewsList?'
export const GET_DETAIL_NEWS = '/api/News/NewsDetail?'

// Export  teacher salary detail
export const EXPORT_EXCEL_TEACHER_DETAIL_SALARY = '/api/Teachers/ExportTeacherSalaryDetails?'

// Export  teacher salary
export const EXPORT_EXCEL_TEACHER_SALARY = '/api/Teachers/ExportTeacherSalary?'

// Function role
export const FUNCTION_ROLE = '/api/CenterDetails/Functions/GroupFunction?'

// Lesson content
export const VIEW_LESSON_CONTENT = '/api/Classes/ClassSyllabus'

//feed back management
export const FEED_BACK_SEARCH_MANAGEMENT = '/api/Classes/FeedbackSearch?'
export const FEED_BACK_DELETE_MANAGEMENT = '/api/Classes/RemoveFeedback?'
export const FEED_BACK_DETAIL_MANAGEMENT = '/api/Classes/Feedback?'
export const FEED_BACK_UPDATE_STATUS_MANAGEMENT = '/api/Classes/UpdateFeedback?'
export const FEEDBACK_CREATE_TO_STUDENTS = '/api/Feedbacks/generals/to-students'
export const FEEDBACK_CREATE_TO_CLASS = '/api/Feedbacks/generals/to-class'
export const GET_FEEDBACK_BY_ID = '/api/Feedbacks/details/find?'
export const SEND_FEEDBACK_DETAIL = '/api/Feedbacks/details'
export const GET_FEEDBACK_BY_STUDENT = '/api/Feedbacks/generals/by-student'
export const GET_FEEDBACK_BY_TEACHER = '/api/Feedbacks/generals/by-qc'
export const CHANGE_STATUS_FEEDBACK = '/api/Feedbacks/generals/status?'
export const GET_FEEDBACK_BY_ADMIN = '/api/Feedbacks/generals/by-admin'
export const DELETE_FEEDBACK = '/api/Feedbacks/generals?'
export const GET_DETAIL_GENERAL_BY_ID = '/api/Feedbacks/generals/infor?'
export const GET_STUDENT_INFOR = '/api/Students/StudentProfile?'
// Statistic Management
export const REPORT_STUDENT_CLASS_LIST = '/api/Students/StudentByClasses?'
export const SALES_REPORT_DETAIL = '/api/Reports/SalesReportDetail?'
export const REPORT_STUDENT_ATTENDANCE = '/api/Classes/StudentDiligents?'
export const REPORT_TEACHER_ON_LEAVE = '/api/Teachers/TeacherLeaveBalance?'
export const REPORT_STAFF_ON_LEAVE = '/api/Teachers/StaffLeaveBalance?'
export const REPORT_TEACHER_CHANGES_BY_CLASS = '/api/Classes/SubstituteTeacherOverview'
export const REPORT_TAKE_OVER_TEACHER_CHANGES_BY_CLASS_DETAIL =
  '/api/Classes/SubstituteTeacherDetails?'
export const REPORT_COVER_TEACHER_CHANGES_BY_CLASS_DETAIL =
  '/api/Classes/SubstituteTeacherSchedule?'
export const OUT_STANDING_PAYMENT_BY_DUEDATE = '/api/Reports/OutstandingPaymentbyDueDate?'
export const VISIT_AND_REGISTER = '/api/Reports/VisitAndRegister?'
export const PLACEMENT_TEST = '/api/Reports/PlacementTest?'
export const ABSENT_STUDENTS_REPORT = '/api/Reports/StudentAbsentReport?'
// Report Management
export const GET_LIST_OUTSTANDING = '/api/Reports/OutstandingPaymentReport?'
export const STUDENT_ATTENDANCE_REPORT = '/api/Reports/StudentAttendaceReport?'
export const OVER_VIEW_BY_PROGRAM = '/api/Reports/OverviewByProgram'
export const OVER_VIEW_BY_QC_WITH_LOCATION = '/api/Reports/OverviewByQC?'
export const GET_REPORT_REVENUE = '/api/Reports/RevenueByLocationAndYear?'
export const CASH_JOURNAL_REPORT = '/api/Reports/CashJournalReport_Detail?'
export const BOOK_INVENTORY = '/api/Reports/InvtTrailBalanceReport?'
export const INVTORDERBYCENTER = '/api/Reports/InvtOrderByCenter?'
export const GET_REPORT_STOPPED = '/api/Reports/StoppedStudentReport?'
export const GET_REPORT_Location = '/api/CenterDetails/Centers'
export const DAILY_CASH_REPORT = '/api/Reports/DailyCash?'

// Roadmap
export const GET_STUDY_PATHWAYS = '/api/Students/GetStudyPathway'
export const ADD_STUDY_PATHWAYS = '/api/Students/STUDENTPATHWAYS/Add'
export const UPDATE_STUDY_PATHWAYS = '/api/Students/STUDENTPATHWAYS/Update'
export const DELETE_STUDY_PATHWAYS = '/api/Students/STUDENTPATHWAYS/Delete'
export const GET_COUNSELOR = '/api/Teachers/GetCounselor'
//KPI
export const KPI_REPORT_OVERVIEW = '/api/Reports/KPIOverView?'
export const KPI_STOPPED_STUDENT = '/api/Reports/KPIStoppedStudent?'
export const KPI_REVENUE = '/api/Reports/KPIRevenue?'
export const KPI_SALES = '/api/Reports/KPISales?'

//Task management get
export const APPOINTMENTID = '/api/Task/AppointmentByID?'
export const APPOINTMENTBYTEACHER_ID = '/api/Task/AppointmentByTeacherID?'
export const APPOINTMENTCATEGORIES_LIST = '/api/Task/APPOINTMENTCATEGORIES_List'
export const APPOINTMENTTASKPRIORITIES_LIST = '/api/Task/APPOINTMENTTASKPRIORITIES_List'
export const APPOINTMENTFREQUENCYOCCURS_LIST = '/api/Task/APPOINTMENTFREQUENCYOCCURS_List'
export const APPOINTMENTVISIBILITES_LIST = '/api/Task/APPOINTMENTVISIBILITES_List'
// customer Care
export const GET_CUSTOMERCARE_REPORT = '/api/Reports/CustomerCareReport?'
//Task management POST
export const APPOINTMENT_ADD = '/api/Task/Appointment_Add'
///Task management DELETE
export const APPONTMENT_DELETE = '/api/Task/Appointment_Delete?'
///Task management PUT
export const APPOINTMENT_UPDATE = '/api/Task/Appointment_Update'
export const SALES_REPORT_BY_EQC = '/api/Reports/SalesReportByEQC?'
// Upload image
export const MAX_SIZE_IMAGE_UPLOAD = 5000
// course management
export const COURSE_OVERVIEW_INTER = '/api/Reports/CourseOverviewInter?'
//Monthly comment
export const COMMENT_BY_STUDENT = '/api/MonthlyComment/ByStudent?'
export const COMMENT_DETAIL = '/api/MonthlyComment/ByID?'
export const STUDENT_COMMENT = '/api/MonthlyComment/EditResponse'
export const COMMENT_BY_CLASS = '/api/MonthlyComment/GetListByClass?'
export const ADD_COMMENT = '/api/MonthlyComment/AddComment'
export const EDIT_COMMENT = '/api/MonthlyComment/EditComments'
export const GET_LIST_STUDENT_IN_CLASS = '/api/MonthlyComment/StudentListByClass?'

export const GET_LIST_STUDENT_BY_CENTER_AND_MORE = '/api/MonthlyComment/StudentList?'
export const GET_LIST__COMMENT_BY_CENTER_AND_MORE = '/api/MonthlyComment/GetList?'

// Visitor
export const GET_LIST_VISITOR = '/api/Reports/ListOfVisitor?'

// No homework
export const GET_NO_HOMEWORK = '/api/Reports/NoHomework?'
// telesale
export const GET_TELESALE = '/api/Reports/telesales?'
// reward
export const GET_REWARDTYPE = '/api/AchievementReward/GetTypeList'
export const ADD_REWARD = '/api/AchievementReward/CreateReward'
export const GET_REWARD_BY_ADDMIN = '/api/AchievementReward/SearchLocationDate?'
export const UPDATE_REWARD = '/api/AchievementReward/Update'
export const DELETE_REWARD = '/api/AchievementReward/Delete?'
export const ADD_REWARDTYPE = '/api/AchievementReward/CreateType'
export const UPDATE_REWARDTYPE = '/api/AchievementReward/UpdateType'
export const GET_REWARD_BY_STUDENT = '/api/AchievementReward/ByStudent?'

// make up lesson
export const GET_LIST_MAKEUP_LESSON = '/api/MakeupLesson/LessonListByProgram?'
export const GET_LIST_PROGRAM = '/api/MakeUpLesson/ProgramList'
export const ADD_MAKEUP_ITEM = '/api/MakeUpLesson/Create'
export const UPDATE_MAKEUP_ITEM = '/api/MakeUpLesson/Update'
export const GET_LIST_MAKEUP = '/api/MakeUpLesson/GetList?'
export const DELETE_RE_MAKEUP = '/api/MakeUpLesson/Delete?'
export const GET_MAKEUP_LESSON_BYID = '/api/MakeUpLesson/GetByID?'
// activities
export const GET_ACTIVITY_BY_ID = '/api/SideActivities/GetByID?'
export const GET_LIST_ACTIVITY_TYPE = '/api/SideActivities/ListType'
export const GET_TARGET_ACTIVITY = '/api/SideActivities/Report?'
export const SEARCH_LIST_ACTICITY = '/api/SideActivities/Search?'
export const GET_LIST_REGISTER = '/api/SideActivities/SearchRegister?'
export const GET_ACTIVITY_BY_STUDENT = '/api/SideActivities/ListByStudent?'
export const GET_ACTIVITY_BY_REGISTRATION = '/api/SideActivities/RegistrationByID?'

export const CREATE_TYPE_ACTIVITY = '/api/SideActivities/CreateType'
export const CREATE_REGISTER_ACTIVITY = '/api/SideActivities/CreateRegistration'
export const CREATE_ACTIVITY = '/api/SideActivities/Create'

export const DELETE_ACTIVITY = '/api/SideActivities/Delete?'

export const UPDATE_ACTYVITY_TYPE = '/api/SideActivities/UpdateType'
export const UPDATE_ACTIVITY = '/api/SideActivities/Update'
export const UPDATE_REGISTER_STATUS = '/api/SideActivities/UpdateStatus'
export const UPDATE_REGISTER_ACTIVITY = '/api/SideActivities/UpdateRegistration'
export const UPDATE_TARGET_ACTIVIY = '/api/SideActivities/UpdateTarget'
export const UPDATE_STUDENT_REMARK = '/api/SideActivities/SearchRegister/UpdateNote?'

export const GET_LIST_STUDENT_BY_CENTER = '/api/Students/ByCenterID?'
export const GET_LIST_CLASS = '/api/Students/ListStudentRegisteredByID?'
// test result
export const GET_LIST_RESULT_BY_TEST = '/api/TestResult/GetByID?'
export const GET_LIST_TEST = '/api/TestResult/GetListByClass?'
export const GET_LIST_RESULT = '/api/TestResult/GetListResultByClass?'
export const GET_ONE_RESULT = '/api/TestResult/GetByID?'
export const CREATE_TEST_RESULT = '/api/TestResult/Create'
export const EDIT_RESULT = '/api/TestResult/Edit'
export const EDIT_RESULT_TO_ONE = '/api/TestResult/EditStudent'
export const DELETE_RESULT = '/api/TestResult/delete?'

//Room
export const GET_ROOM_CALENDAR = '/api/Rooms/by-LocationAndDate?'
export const GET_ROOM_FREE = '/api/Rooms/free?'

export const SET_ROOM = '/api/Rooms/update-room-schedules'

export const GET_NO_ROOM = '/api/Rooms/not-register?'

// referencies
export const CREATE_FOLDER = '/api/ReferenceLibrary/Folder/Create'
export const CREATE_TAG = '/api/ReferenceLibrary/Tag/Create'
export const CREATE_REFERENCE = '/api/ReferenceLibrary/Create'
export const UPDATE_FOLDER = '/api/ReferenceLibrary/Folder/Update'
export const UPDATE_TAG = '/api/ReferenceLibrary/Tag/Update'
export const UPDATE_REFERENCE = '/api/ReferenceLibrary/Update'
export const DELETE_TAG = '/api/ReferenceLibrary/Tag/Delete?'
export const DELETE_REFERENCE = '/api/ReferenceLibrary/Delete?'
export const DELETE_FOLDER = '/api/ReferenceLibrary/Folder/Delete?'
export const GET_FOLDER_BY_LIBTYPE = '/api/ReferenceLibrary/Folder/Find-by-libraryType?'
export const GET_REFERENCE_BY_ID = '/api/ReferenceLibrary/Find-by-ReferenceID?'
export const GET_REFERENCE_BY_FID = '/api/ReferenceLibrary/Find-by-libraryFolderID?'
export const GET_TAGLIST = '/api/ReferenceLibrary/Tag/GetList'
export const GET_SUBFOLDER = 'api/ReferenceLibrary/SubFolder-by-libraryFolderID'
export const GET_ALL = 'api/ReferenceLibrary/Folder/All-by-libraryType?'

//Dashboard reports
export const GET_PTSTUDENTS = '/api/Reports/PTStudentsReport?'
export const UPDATE_PTSTUDENTS = '/api/Reports/PTStudentsReport/Remarks_Update?'
export const GET_REGISTRATIONSTATE = '/api/Reports/RegisStateReport?'
export const UPDATE_REGISTRATIONSTATE = '/api/Reports/RegisStateReport/Note_Update?'
