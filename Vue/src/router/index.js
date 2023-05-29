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
        children: [],
      },

      {
        path: '/check-your-email',
        name: 'check-your-email',
        meta: { title: 'Check Your Email - CEC App' },
        component: () => import('@/view/CheckYourEmail.vue'),
      },

      {
        path: '/version',
        name: 'version-view',
        meta: { title: 'Version' },
        component: () => import('@/components/ListVersion/ListVersion.vue'),
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
        path: '/my-profile/edit/:userId',
        name: 'my-profile-edit',
        meta: { title: 'My Profile - Edit' },
        component: () => import('@/components/MyProfile/Edit.vue'),
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
        ],
      },
      {
        path: '/department-management',
        name: 'department-management',
        meta: { title: 'Department Management' },
        redirect: '/department-management/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/department-management/overview',
            name: 'department-management-overview',
            meta: { title: 'Department Management - Over View' },
            component: () => import('@/components/DepartmentManagement/Overview.vue'),
            children: [],
          },
          // {
          //   path: '/department-management/add-new',
          //   name: 'department-add-new',
          //   meta: { title: 'Department Management - Add New' },
          //   component: () => import('@/components/DepartmentManagement/AddNew.vue'),
          //   children: [],
          // },
        ],
      },
      {
        path: '/employee-management',
        name: 'employee-management',
        meta: { title: 'Employee Management' },
        redirect: '/employee-management/overview',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/employee-management/overview',
            name: 'employee-management-overview',
            meta: { title: 'Employee Management - Over View' },
            component: () => import('@/components/EmployeeManagement/Overview.vue'),
            children: [],
          },
          {
            path: '/employee-management/add-new',
            name: 'employee-add-new',
            meta: { title: 'Employee Management - Add New' },
            component: () => import('@/components/EmployeeManagement/AddNew.vue'),
            children: [],
          },
        ],
      },
      {
        path: '/contract-management',
        name: 'contract-management',
        meta: { title: 'Contract Management' },
        redirect: '/contract-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/contract-management/overview',
            name: 'contract-management-overview',
            meta: { title: 'Contract Management - Over View' },
            component: () => import('@/components/ContractManagement/Overview.vue'),
            children: [],
          },
          // {
          //   path: '/contract-management/add-new',
          //   name: 'contract-add-new',
          //   meta: { title: 'Contract Management - Add New' },
          //   component: () => import('@/components/ContractManagement/AddNew.vue'),
          //   children: [],
          // },
        ],
      },
      {
        path: '/plan-management',
        name: 'plan-management',
        meta: { title: 'Plan Management' },
        redirect: '/plan-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/plan-management/overview',
            name: 'plan-management-overview',
            meta: { title: 'Plan Management - Over View' },
            component: () => import('@/components/PlanManagement/Overview.vue'),
            children: [],
          },
          // {
          //   path: '/plan-management/add-new',
          //   name: 'plan-add-new',
          //   meta: { title: 'Plan Management - Add New' },
          //   component: () => import('@/components/PlanManagement/AddNew.vue'),
          //   children: [],
          // },
        ],
      },
      {
        path: '/qualification-management',
        name: 'qualification-management',
        meta: { title: 'Qualification Management' },
        redirect: '/qualification-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/qualification-management/overview',
            name: 'qualification-management-overview',
            meta: { title: 'Qualification Management - Over View' },
            component: () => import('@/components/QualificationManagement/Overview.vue'),
            children: [],
          },
          // {
          //   path: '/qualification-management/add-new',
          //   name: 'qualification-add-new',
          //   meta: { title: 'Qualification Management - Add New' },
          //   component: () => import('@/components/QualificationManagement/AddNew.vue'),
          //   children: [],
          // },
        ],
      },
      {
        path: '/leave-request-management',
        name: 'leave-request-management',
        meta: { title: 'Leave Request Management' },
        redirect: '/leave-request-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/leave-request-management/overview',
            name: 'leave-request-management-overview',
            meta: { title: 'Leave Request Management - Over View' },
            component: () => import('@/components/LeaveRequestManagement/Overview.vue'),
            children: [],
          },
          // {
          //   path: '/leave-request-management/add-new',
          //   name: 'leave-request-add-new',
          //   meta: { title: 'Leave Request Management - Add New' },
          //   component: () => import('@/components/LeaveRequestManagement/AddNew.vue'),
          //   children: [],
          // },
        ],
      },
      {
        path: '/promotion-management',
        name: 'promotion-management',
        meta: { title: 'Promotion Management' },
        redirect: '/promotion-management/add-new',
        component: () => import('@/view/Sub.vue'),
        children: [
          {
            path: '/promotion-management/overview',
            name: 'promotion-management-overview',
            meta: { title: 'Promotion Management - Over View' },
            component: () => import('@/components/PromotionManagement/Overview.vue'),
            children: [],
          },
          // {
          //   path: '/promotion-management/add-new',
          //   name: 'promotion-add-new',
          //   meta: { title: 'Promotion Management - Add New' },
          //   component: () => import('@/components/PromotionManagement/AddNew.vue'),
          //   children: [],
          // },
        ],
      },
    ],
  },

  {
    path: '/login',
    name: 'login',
    meta: { title: 'Login - Vue App' },
    component: () => import('@/view/Login.vue'),
  },
  // {
  //   path: '/change-password',
  //   name: 'change-password',
  //   meta: { title: 'Change Password - QuangT App' },
  //   component: () => import('@/view/ChangePassword.vue'),
  // },
  // {
  //   path: '/signup',
  //   name: 'signup',
  //   meta: { title: 'Sign Up - QuangT App' },
  //   component: () => import('@/view/SignUp.vue'),
  // },
  // {
  //   path: '/forgot-password',
  //   name: 'forgot-password',
  //   meta: { title: 'Forgot Password - QuangT App' },
  //   component: () => import('@/view/ForgotPassword.vue'),
  // },
  // {
  //   path: '/reset-password',
  //   name: 'reset-password',
  //   meta: { title: 'Reset Password - CEC App' },
  //   component: () => import('@/view/ResetPassword.vue'),
  // },
  // {
  //   path: '/not-found',
  //   name: 'not-found',
  //   meta: { title: 'Not Found - CEC App' },
  //   component: () => import('@/components/Error/NotFound.vue'),
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router

const DEFAULT_TITLE = 'Hệ thống quản lý hồ sơ'
router.beforeEach((to, from, next) => {
  Vue.nextTick(() => {
    document.title = DEFAULT_TITLE
  })

  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {}

  if (to.path === '/home') {
    if (!authRequired && !currentUser) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
