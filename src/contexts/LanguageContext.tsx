import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.welcome': 'Welcome',
    
    // Navigation
    'dashboard': 'Dashboard',
    'users': 'Users',
    'plans': 'Plans',
    'content': 'Content',
    'consultations': 'Consultations',
    'drafts': 'Drafts',
    'projects': 'Projects',
    'courses': 'Courses',
    'logout': 'Sign out',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.loginSuccess': 'Login successful',
    'auth.logoutSuccess': 'Logout successful',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.accountCreated': 'Account created successfully',
    'auth.welcomeToPlenaria': 'Welcome to Plenaria',
    'auth.signInToAccount': 'Sign in to your account',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.signUpHere': 'Sign up here',
    'auth.loginFailed': 'Login failed',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.signingIn': 'Signing in...',
    'auth.signIn': 'Sign in',
    'auth.signUp': 'Sign up',
    'auth.demoAccounts': 'Demo Accounts:',
    'auth.createAccount': 'Create Account',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signInHere': 'Sign in here',
    'auth.passwordsDoNotMatch': 'Passwords do not match',
    'auth.passwordTooShort': 'Password must be at least 6 characters long',
    'auth.creatingAccount': 'Creating account...',
    'auth.name': 'Name',
    'auth.enterName': 'Enter your name',
    'auth.joinPlenaria': 'Join Plenaria today',
    'auth.fullName': 'Full Name',
    'auth.enterFullName': 'Enter your full name',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    
    // Roles
    'role.admin': 'Admin',
    'role.lawyer': 'Lawyer',
    'role.customer': 'Customer',
    
    // Plans
    'plan.basic': 'Basic',
    'plan.plus': 'Plus',
    'plan.complete': 'Complete',
    'plan.monthly': 'Monthly',
    'plan.unlimited': 'Unlimited',
    'plan.consultations': 'Consultations',
    'plan.courseAccess': 'Course Access',
    'plan.upgradeRequired': 'Upgrade Required',
    'plan.limitReached': 'Limit Reached',
    
    // Status
    'status.pending': 'Pending',
    'status.assigned': 'Assigned',
    'status.inProgress': 'In Progress',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    
    // Priority
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    'priority.urgent': 'Urgent',
    
    // Dashboard
    'dashboard.welcome': 'Overview of users, plans, and consultations',
    'dashboard.statistics': 'Total Users',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.admins': 'Admins',
    'dashboard.projects': 'Projects',
    'dashboard.courses': 'Courses',
    'dashboard.recentUsers': 'Recent Users',
    'dashboard.recentContent': 'Recent Consultations',
    'dashboard.systemStats': 'System Statistics',
    'dashboard.manageUsers': 'Manage Users',
    'dashboard.managePlans': 'Manage Plans',
    'dashboard.manageContent': 'Manage Consultations',
    'dashboard.viewAllContent': 'View All Consultations',
    'dashboard.systemAdministrators': 'System administrators',
    'dashboard.availableInDatabase': 'Available in database',
    'dashboard.trainingMaterials': 'Training materials',
    'dashboard.customers': 'customers',
    'dashboard.lawyers': 'lawyers',
    'dashboard.latestProjects': 'Latest Projects',
    'dashboard.latestCourses': 'Latest Courses',
    'dashboard.viewConsultations': 'View Consultations',
    
    // Admin Users
    'admin.users.title': 'User Management',
    'admin.users.subtitle': 'Manage all users and their roles',
    'admin.users.search': 'Search users...',
    'admin.users.filterByRole': 'Filter by role',
    'admin.users.filterByStatus': 'Filter by status',
    'admin.users.allRoles': 'All Roles',
    'admin.users.allStatuses': 'All Statuses',
    'admin.users.approve': 'Approve',
    'admin.users.reject': 'Reject',
    'admin.users.edit': 'Edit',
    'admin.users.delete': 'Delete',
    'admin.users.editUser': 'Edit User',
    'admin.users.selectPlan': 'Select Plan',
    'admin.users.save': 'Save Changes',
    'admin.users.cancel': 'Cancel',
    'admin.users.noUsers': 'No users found',
    'admin.users.createdAt': 'Created',
    'admin.users.admins': 'Admins',
    'admin.users.lawyers': 'Lawyers',
    'admin.users.customers': 'Customers',
    'admin.users.pendingApplications': 'lawyer application(s) pending',
    'admin.users.requiresAttention': 'Requires your attention',
    'admin.users.adminPrivileges': 'Admin privileges',
    
    // Dashboard specific
    'dashboard.noDataAvailable': 'No Data Available',
    'dashboard.unableToLoad': 'Unable to load dashboard data',
    'dashboard.clearAuth': 'Clear Auth & Reload',
    'dashboard.lawyer': 'Lawyer',
    'dashboard.customer': 'Customer',
    'dashboard.noRecentUsers': 'No recent users',
    
    // Consultations
    'consultation.request': 'Request Consultation',
    'consultation.subject': 'Subject',
    'consultation.description': 'Description',
    'consultation.priority': 'Priority',
    'consultation.response': 'Response',
    'consultation.notes': 'Notes',
    'consultation.lawyer': 'Lawyer',
    'consultation.client': 'Client',
    'consultation.requestedAt': 'Requested At',
    'consultation.answeredAt': 'Answered At',
    
    // Projects
    'project.title': 'Title',
    'project.description': 'Description',
    'project.category': 'Category',
    'project.tags': 'Tags',
    'project.download': 'Download',
    'project.fileSize': 'File Size',
    'project.createdBy': 'Created By',
    'project.createdAt': 'Created At',
    
    // Courses
    'course.title': 'Title',
    'course.description': 'Description',
    'course.category': 'Category',
    'course.level': 'Level',
    'course.duration': 'Duration',
    'course.startCourse': 'Start Course',
    'course.learningObjectives': 'Learning Objectives',
    'course.prerequisites': 'Prerequisites',
    'course.enrollmentCount': 'Enrolled',
    'course.rating': 'Rating',
    
    // Drafts
    'draft.title': 'Title',
    'draft.description': 'Description',
    'draft.type': 'Type',
    'draft.category': 'Category',
    'draft.tags': 'Tags',
    'draft.fileUrl': 'File URL',
    'draft.fileType': 'File Type',
    'draft.fileSize': 'File Size',
    'draft.isPublic': 'Public',
    'draft.legalOpinion': 'Legal Opinion',
    'draft.contract': 'Contract',
    'draft.motion': 'Motion',
    'draft.brief': 'Brief',
    'draft.other': 'Other',
    
    // Messages
    'message.noData': 'No data available',
    'message.loading': 'Loading data...',
    'message.error': 'An error occurred',
    'message.success': 'Operation successful',
    'message.confirmDelete': 'Are you sure you want to delete this item?',
    'message.unsavedChanges': 'You have unsaved changes. Are you sure you want to leave?',
    
    // Validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email',
    'validation.minLength': 'Minimum length is {min} characters',
    'validation.maxLength': 'Maximum length is {max} characters',
    'validation.password': 'Password must be at least 6 characters',
    
    // Admin Plans
    'admin.plans.title': 'Subscription Plans',
    'admin.plans.subtitle': 'Manage subscription plans and pricing',
    'admin.plans.createPlan': 'Create New Plan',
    'admin.plans.editPlan': 'Edit Plan',
    'admin.plans.planName': 'Plan Name',
    'admin.plans.description': 'Description',
    'admin.plans.price': 'Price',
    'admin.plans.currency': 'Currency',
    'admin.plans.billingCycle': 'Billing Cycle',
    'admin.plans.monthly': 'Monthly',
    'admin.plans.yearly': 'Yearly',
    'admin.plans.maxConsultations': 'Max Consultations',
    'admin.plans.unlimited': 'Unlimited (0 for unlimited)',
    'admin.plans.features': 'Features',
    'admin.plans.addFeature': 'Add Feature',
    'admin.plans.removeFeature': 'Remove',
    'admin.plans.hasProjectDatabase': 'Access to Project Database',
    'admin.plans.hasCourses': 'Access to Courses',
    'admin.plans.isActive': 'Active',
    'admin.plans.create': 'Create Plan',
    'admin.plans.update': 'Update Plan',
    'admin.plans.delete': 'Delete Plan',
    'admin.plans.confirmDelete': 'Are you sure you want to delete this plan?',
    'admin.plans.planCreated': 'Plan created successfully',
    'admin.plans.planUpdated': 'Plan updated successfully',
    'admin.plans.planDeleted': 'Plan deleted successfully',
    
    // Admin Content
    'admin.content.title': 'Content Management',
    'admin.content.subtitle': 'Manage projects and courses',
    'admin.content.projects': 'Projects',
    'admin.content.courses': 'Courses',
    'admin.content.addProject': 'Add Project',
    'admin.content.addCourse': 'Add Course',
    'admin.content.createProject': 'Create New Project',
    'admin.content.createCourse': 'Create New Course',
    'admin.content.editProject': 'Edit Project',
    'admin.content.editCourse': 'Edit Course',
    'admin.content.deleteProject': 'Delete Project',
    'admin.content.deleteCourse': 'Delete Course',
    'admin.content.confirmDeleteProject': 'Are you sure you want to delete this project?',
    'admin.content.confirmDeleteCourse': 'Are you sure you want to delete this course?',
    'admin.content.projectCreated': 'Project created successfully',
    'admin.content.courseCreated': 'Course created successfully',
    'admin.content.projectUpdated': 'Project updated successfully',
    'admin.content.courseUpdated': 'Course updated successfully',
    'admin.content.projectDeleted': 'Project deleted successfully',
    'admin.content.courseDeleted': 'Course deleted successfully',
    'admin.content.noProjects': 'No projects yet',
    'admin.content.noCourses': 'No courses yet',
    'admin.content.projectDescription': 'Get started by adding your first project. Create templates and resources for your users.',
    'admin.content.courseDescription': 'Get started by adding your first course with video. Create educational content for your users.',
    'admin.content.videoUrl': 'Video URL (YouTube/Vimeo)',
    'admin.content.thumbnailUrl': 'Thumbnail URL (optional)',
    'admin.content.duration': 'Duration (minutes)',
    'admin.content.level': 'Level',
    'admin.content.beginner': 'Beginner',
    'admin.content.intermediate': 'Intermediate',
    'admin.content.advanced': 'Advanced',
    'admin.content.fileUrl': 'File URL',
    'admin.content.fileType': 'File Type',
    'admin.content.fileSize': 'File Size (bytes)',
    'admin.content.isPublic': 'Public',
    'admin.content.start': 'Start',
    'admin.content.preview': 'Preview',
  },
  pt: {
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.view': 'Visualizar',
    'common.create': 'Criar',
    'common.update': 'Atualizar',
    'common.search': 'Pesquisar',
    'common.filter': 'Filtrar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.close': 'Fechar',
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.confirm': 'Confirmar',
    'common.back': 'Voltar',
    'common.continue': 'Continuar',
    'common.welcome': 'Bem-vindo',
    
    // Navigation
    'dashboard': 'Painel',
    'users': 'Usuários',
    'plans': 'Planos',
    'content': 'Conteúdo',
    'consultations': 'Consultorias',
    'drafts': 'Rascunhos',
    'projects': 'Projetos',
    'courses': 'Cursos',
    'logout': 'Sair',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.register': 'Registrar',
    'auth.logout': 'Sair',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.confirmPassword': 'Confirmar Senha',
    'auth.forgotPassword': 'Esqueceu a senha?',
    'auth.rememberMe': 'Lembrar de mim',
    'auth.loginSuccess': 'Login realizado com sucesso',
    'auth.logoutSuccess': 'Logout realizado com sucesso',
    'auth.invalidCredentials': 'Email ou senha inválidos',
    'auth.accountCreated': 'Conta criada com sucesso',
    'auth.welcomeToPlenaria': 'Bem-vindo ao Plenaria',
    'auth.signInToAccount': 'Entre na sua conta',
    'auth.dontHaveAccount': 'Não tem uma conta?',
    'auth.signUpHere': 'Cadastre-se aqui',
    'auth.loginFailed': 'Falha no login',
    'auth.enterEmail': 'Digite seu email',
    'auth.enterPassword': 'Digite sua senha',
    'auth.signingIn': 'Entrando...',
    'auth.signIn': 'Entrar',
    'auth.signUp': 'Cadastrar',
    'auth.demoAccounts': 'Contas Demo:',
    'auth.createAccount': 'Criar Conta',
    'auth.alreadyHaveAccount': 'Já tem uma conta?',
    'auth.signInHere': 'Entre aqui',
    'auth.passwordsDoNotMatch': 'As senhas não coincidem',
    'auth.passwordTooShort': 'A senha deve ter pelo menos 6 caracteres',
    'auth.creatingAccount': 'Criando conta...',
    'auth.name': 'Nome',
    'auth.enterName': 'Digite seu nome',
    'auth.joinPlenaria': 'Junte-se ao Plenaria hoje',
    'auth.fullName': 'Nome Completo',
    'auth.enterFullName': 'Digite seu nome completo',
    'auth.confirmPasswordPlaceholder': 'Confirme sua senha',
    
    // Roles
    'role.admin': 'Administrador',
    'role.lawyer': 'Advogado',
    'role.customer': 'Cliente',
    
    // Plans
    'plan.basic': 'Básico',
    'plan.plus': 'Plus',
    'plan.complete': 'Completo',
    'plan.monthly': 'Mensal',
    'plan.unlimited': 'Ilimitado',
    'plan.consultations': 'Consultorias',
    'plan.courseAccess': 'Acesso a Cursos',
    'plan.upgradeRequired': 'Upgrade Necessário',
    'plan.limitReached': 'Limite Atingido',
    
    // Status
    'status.pending': 'Pendente',
    'status.assigned': 'Atribuído',
    'status.inProgress': 'Em Andamento',
    'status.completed': 'Concluído',
    'status.cancelled': 'Cancelado',
    
    // Priority
    'priority.low': 'Baixa',
    'priority.medium': 'Média',
    'priority.high': 'Alta',
    'priority.urgent': 'Urgente',
    
    // Dashboard
    'dashboard.welcome': 'Visão geral de usuários, planos e conteúdo',
    'dashboard.statistics': 'Total de Usuários',
    'dashboard.recentActivity': 'Atividade Recente',
    'dashboard.quickActions': 'Ações Rápidas',
    'dashboard.admins': 'Administradores',
    'dashboard.projects': 'Projetos',
    'dashboard.courses': 'Cursos',
    'dashboard.recentUsers': 'Usuários Recentes',
    'dashboard.recentContent': 'Consultorias Recentes',
    'dashboard.systemStats': 'Estatísticas do Sistema',
    'dashboard.manageUsers': 'Gerenciar Usuários',
    'dashboard.managePlans': 'Gerenciar Planos',
    'dashboard.manageContent': 'Gerenciar Consultorias',
    'dashboard.viewAllContent': 'Ver Todas as Consultorias',
    'dashboard.systemAdministrators': 'Administradores do sistema',
    'dashboard.availableInDatabase': 'Disponível no banco de dados',
    'dashboard.trainingMaterials': 'Materiais de treinamento',
    'dashboard.customers': 'clientes',
    'dashboard.lawyers': 'advogados',
    'dashboard.latestProjects': 'Projetos Recentes',
    'dashboard.latestCourses': 'Cursos Recentes',
    'dashboard.viewConsultations': 'Ver Consultorias',
    
    // Admin Users
    'admin.users.title': 'Gerenciamento de Usuários',
    'admin.users.subtitle': 'Gerencie todos os usuários e suas funções',
    'admin.users.search': 'Pesquisar usuários...',
    'admin.users.filterByRole': 'Filtrar por função',
    'admin.users.filterByStatus': 'Filtrar por status',
    'admin.users.allRoles': 'Todas as Funções',
    'admin.users.allStatuses': 'Todos os Status',
    'admin.users.approve': 'Aprovar',
    'admin.users.reject': 'Rejeitar',
    'admin.users.edit': 'Editar',
    'admin.users.delete': 'Excluir',
    'admin.users.editUser': 'Editar Usuário',
    'admin.users.selectPlan': 'Selecionar Plano',
    'admin.users.save': 'Salvar Alterações',
    'admin.users.cancel': 'Cancelar',
    'admin.users.noUsers': 'Nenhum usuário encontrado',
    'admin.users.createdAt': 'Criado',
    'admin.users.admins': 'Administradores',
    'admin.users.lawyers': 'Advogados',
    'admin.users.customers': 'Clientes',
    'admin.users.pendingApplications': 'candidatura(s) de advogado pendente(s)',
    'admin.users.requiresAttention': 'Requer sua atenção',
    'admin.users.adminPrivileges': 'Privilégios de administrador',
    
    // Dashboard specific
    'dashboard.noDataAvailable': 'Nenhum Dado Disponível',
    'dashboard.unableToLoad': 'Não foi possível carregar os dados do painel',
    'dashboard.clearAuth': 'Limpar Auth e Recarregar',
    'dashboard.lawyer': 'Advogado',
    'dashboard.customer': 'Cliente',
    'dashboard.noRecentUsers': 'Nenhum usuário recente',
    
    // Consultations
    'consultation.request': 'Solicitar Consultoria',
    'consultation.subject': 'Assunto',
    'consultation.description': 'Descrição',
    'consultation.priority': 'Prioridade',
    'consultation.response': 'Resposta',
    'consultation.notes': 'Notas',
    'consultation.lawyer': 'Advogado',
    'consultation.client': 'Cliente',
    'consultation.requestedAt': 'Solicitado em',
    'consultation.answeredAt': 'Respondido em',
    
    // Projects
    'project.title': 'Título',
    'project.description': 'Descrição',
    'project.category': 'Categoria',
    'project.tags': 'Tags',
    'project.download': 'Baixar',
    'project.fileSize': 'Tamanho do Arquivo',
    'project.createdBy': 'Criado por',
    'project.createdAt': 'Criado em',
    
    // Courses
    'course.title': 'Título',
    'course.description': 'Descrição',
    'course.category': 'Categoria',
    'course.level': 'Nível',
    'course.duration': 'Duração',
    'course.startCourse': 'Iniciar Curso',
    'course.learningObjectives': 'Objetivos de Aprendizagem',
    'course.prerequisites': 'Pré-requisitos',
    'course.enrollmentCount': 'Inscritos',
    'course.rating': 'Avaliação',
    
    // Drafts
    'draft.title': 'Título',
    'draft.description': 'Descrição',
    'draft.type': 'Tipo',
    'draft.category': 'Categoria',
    'draft.tags': 'Tags',
    'draft.fileUrl': 'URL do Arquivo',
    'draft.fileType': 'Tipo de Arquivo',
    'draft.fileSize': 'Tamanho do Arquivo',
    'draft.isPublic': 'Público',
    'draft.legalOpinion': 'Parecer Jurídico',
    'draft.contract': 'Contrato',
    'draft.motion': 'Petição',
    'draft.brief': 'Memorial',
    'draft.other': 'Outro',
    
    // Messages
    'message.noData': 'Nenhum dado disponível',
    'message.loading': 'Carregando dados...',
    'message.error': 'Ocorreu um erro',
    'message.success': 'Operação realizada com sucesso',
    'message.confirmDelete': 'Tem certeza que deseja excluir este item?',
    'message.unsavedChanges': 'Você tem alterações não salvas. Tem certeza que deseja sair?',
    
    // Validation
    'validation.required': 'Este campo é obrigatório',
    'validation.email': 'Por favor, insira um email válido',
    'validation.minLength': 'Tamanho mínimo é {min} caracteres',
    'validation.maxLength': 'Tamanho máximo é {max} caracteres',
    'validation.password': 'A senha deve ter pelo menos 6 caracteres',
    
    // Admin Plans
    'admin.plans.title': 'Planos de Assinatura',
    'admin.plans.subtitle': 'Gerencie planos de assinatura e preços',
    'admin.plans.createPlan': 'Criar Novo Plano',
    'admin.plans.editPlan': 'Editar Plano',
    'admin.plans.planName': 'Nome do Plano',
    'admin.plans.description': 'Descrição',
    'admin.plans.price': 'Preço',
    'admin.plans.currency': 'Moeda',
    'admin.plans.billingCycle': 'Ciclo de Cobrança',
    'admin.plans.monthly': 'Mensal',
    'admin.plans.yearly': 'Anual',
    'admin.plans.maxConsultations': 'Máx. Consultorias',
    'admin.plans.unlimited': 'Ilimitado (0 para ilimitado)',
    'admin.plans.features': 'Recursos',
    'admin.plans.addFeature': 'Adicionar Recurso',
    'admin.plans.removeFeature': 'Remover',
    'admin.plans.hasProjectDatabase': 'Acesso ao Banco de Projetos',
    'admin.plans.hasCourses': 'Acesso aos Cursos',
    'admin.plans.isActive': 'Ativo',
    'admin.plans.create': 'Criar Plano',
    'admin.plans.update': 'Atualizar Plano',
    'admin.plans.delete': 'Excluir Plano',
    'admin.plans.confirmDelete': 'Tem certeza que deseja excluir este plano?',
    'admin.plans.planCreated': 'Plano criado com sucesso',
    'admin.plans.planUpdated': 'Plano atualizado com sucesso',
    'admin.plans.planDeleted': 'Plano excluído com sucesso',
    
    // Admin Content
    'admin.content.title': 'Gerenciamento de Conteúdo',
    'admin.content.subtitle': 'Gerencie projetos e cursos',
    'admin.content.projects': 'Projetos',
    'admin.content.courses': 'Cursos',
    'admin.content.addProject': 'Adicionar Projeto',
    'admin.content.addCourse': 'Adicionar Curso',
    'admin.content.createProject': 'Criar Novo Projeto',
    'admin.content.createCourse': 'Criar Novo Curso',
    'admin.content.editProject': 'Editar Projeto',
    'admin.content.editCourse': 'Editar Curso',
    'admin.content.deleteProject': 'Excluir Projeto',
    'admin.content.deleteCourse': 'Excluir Curso',
    'admin.content.confirmDeleteProject': 'Tem certeza que deseja excluir este projeto?',
    'admin.content.confirmDeleteCourse': 'Tem certeza que deseja excluir este curso?',
    'admin.content.projectCreated': 'Projeto criado com sucesso',
    'admin.content.courseCreated': 'Curso criado com sucesso',
    'admin.content.projectUpdated': 'Projeto atualizado com sucesso',
    'admin.content.courseUpdated': 'Curso atualizado com sucesso',
    'admin.content.projectDeleted': 'Projeto excluído com sucesso',
    'admin.content.courseDeleted': 'Curso excluído com sucesso',
    'admin.content.noProjects': 'Nenhum projeto ainda',
    'admin.content.noCourses': 'Nenhum curso ainda',
    'admin.content.projectDescription': 'Comece adicionando seu primeiro projeto. Crie modelos e recursos para seus usuários.',
    'admin.content.courseDescription': 'Comece adicionando seu primeiro curso com vídeo. Crie conteúdo educacional para seus usuários.',
    'admin.content.videoUrl': 'URL do Vídeo (YouTube/Vimeo)',
    'admin.content.thumbnailUrl': 'URL da Miniatura (opcional)',
    'admin.content.duration': 'Duração (minutos)',
    'admin.content.level': 'Nível',
    'admin.content.beginner': 'Iniciante',
    'admin.content.intermediate': 'Intermediário',
    'admin.content.advanced': 'Avançado',
    'admin.content.fileUrl': 'URL do Arquivo',
    'admin.content.fileType': 'Tipo de Arquivo',
    'admin.content.fileSize': 'Tamanho do Arquivo (bytes)',
    'admin.content.isPublic': 'Público',
    'admin.content.start': 'Iniciar',
    'admin.content.preview': 'Visualizar',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('plenaria-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguage(savedLanguage);
    } else {
      // Default to Portuguese if no saved language
      setLanguage('pt');
      localStorage.setItem('plenaria-language', 'pt');
    }
  }, []);

  // Save language to localStorage when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('plenaria-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if no translation found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

