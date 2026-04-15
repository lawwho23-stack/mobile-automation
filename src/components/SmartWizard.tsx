import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Sparkles, ArrowRight, ChevronRight, MessageSquare, Calendar, Mail, Table, Send, Bot, Zap, Check } from 'lucide-react';
import type { NodeType } from '../store/flowStore';
import { getTranslation } from '../lib/i18n';

interface SmartWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (nodes: Array<{ type: NodeType; name: string; config: Record<string, any> }>) => void;
  existingNodes: Array<{ type: string; name: string }>;
  onAddNode: (type: NodeType, name: string) => void;
}

interface UserGoal {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
  recommendedNodes: Array<{ type: NodeType; name: string; config: Record<string, any> }>;
}

const USER_GOALS: UserGoal[] = [
  {
    id: 'notify_telegram',
    icon: Send,
    titleKey: 'wizard_goal_notify_telegram',
    descriptionKey: 'wizard_goal_notify_telegram_desc',
    recommendedNodes: [
      { type: 'trigger_telegram', name: 'Telegram Trigger', config: { command: '/start', autoReply: 'Hello! I received your message.' } },
    ],
  },
  {
    id: 'daily_reminder',
    icon: Calendar,
    titleKey: 'wizard_goal_daily_reminder',
    descriptionKey: 'wizard_goal_daily_reminder_desc',
    recommendedNodes: [
      { type: 'trigger_schedule', name: 'Schedule', config: { cron: '0 9 * * *' } },
    ],
  },
  {
    id: 'sheet_automation',
    icon: Table,
    titleKey: 'wizard_goal_sheet_automation',
    descriptionKey: 'wizard_goal_sheet_automation_desc',
    recommendedNodes: [
      { type: 'trigger_sheets', name: 'Google Sheets Trigger', config: {} },
      { type: 'action_telegram', name: 'Send Telegram', config: {} },
    ],
  },
  {
    id: 'ai_summary',
    icon: Bot,
    titleKey: 'wizard_goal_ai_summary',
    descriptionKey: 'wizard_goal_ai_summary_desc',
    recommendedNodes: [
      { type: 'trigger_telegram', name: 'Telegram Trigger', config: {} },
      { type: 'action_agent', name: 'AI Agent', config: { prompt: 'Summarize this message in simple Burmese: {{telegram.message.text}}' } },
      { type: 'action_telegram', name: 'Send Telegram', config: { message: '{{agent.output}}' } },
    ],
  },
  {
    id: 'email_alert',
    icon: Mail,
    titleKey: 'wizard_goal_email_alert',
    descriptionKey: 'wizard_goal_email_alert_desc',
    recommendedNodes: [
      { type: 'trigger_schedule', name: 'Schedule', config: {} },
      { type: 'action_gmail', name: 'Send Email', config: {} },
    ],
  },
  {
    id: 'auto_reply',
    icon: MessageSquare,
    titleKey: 'wizard_goal_auto_reply',
    descriptionKey: 'wizard_goal_auto_reply_desc',
    recommendedNodes: [
      { type: 'trigger_telegram', name: 'Telegram Trigger', config: {} },
      { type: 'action_agent', name: 'AI Agent', config: { prompt: 'Generate a friendly response to: {{telegram.message.text}}' } },
    ],
  },
];

const NODE_CATEGORIES = [
  { id: 'trigger', nameKey: 'triggers', color: 'bg-emerald-500/10 border-emerald-500/30', icon: Zap },
  { id: 'action', nameKey: 'actions', color: 'bg-blue-500/10 border-blue-500/30', icon: Bot },
];

const POPULAR_NODES: Array<{ type: NodeType; nameKey: string; icon: React.ElementType; popular: boolean }> = [
  { type: 'trigger_telegram', nameKey: 'trigger_telegram', icon: Send, popular: true },
  { type: 'trigger_schedule', nameKey: 'trigger_schedule', icon: Calendar, popular: true },
  { type: 'trigger_sheets', nameKey: 'trigger_sheets', icon: Table, popular: false },
  { type: 'action_telegram', nameKey: 'action_telegram', icon: Send, popular: true },
  { type: 'action_gmail', nameKey: 'action_gmail', icon: Mail, popular: true },
  { type: 'action_agent', nameKey: 'action_agent', icon: Bot, popular: true },
  { type: 'action_sheets', nameKey: 'action_sheets', icon: Table, popular: false },
  { type: 'action_calendar', nameKey: 'action_calendar', icon: Calendar, popular: false },
  { type: 'action_condition', nameKey: 'action_condition', icon: Zap, popular: false },
];

export function SmartWizard({ isOpen, onClose, onComplete, existingNodes, onAddNode }: SmartWizardProps) {
  const lang = 'my';
  const [step, setStep] = useState<'goals' | 'customize' | 'complete'>('goals');
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const [suggestedNodes, setSuggestedNodes] = useState<Array<{ type: NodeType; name: string; config: Record<string, any> }>>([]);

  const getRecommendations = (): Array<{ type: NodeType; name: string; config: Record<string, any> }> => {
    if (existingNodes.length === 0) {
      return selectedGoal?.recommendedNodes || [];
    }

    const lastNode = existingNodes[existingNodes.length - 1];
    const lastType = lastNode?.type || '';

    const recommendations: Array<{ type: NodeType; name: string; config: Record<string, any>; reason: string }> = [];

    if (lastType.startsWith('trigger_')) {
      if (lastType === 'trigger_telegram') {
        recommendations.push(
          { type: 'action_agent', name: 'AI Agent', config: {}, reason: 'Process the message with AI' },
          { type: 'action_telegram', name: 'Send Telegram', config: {}, reason: 'Reply to the user' },
          { type: 'action_sheets', name: 'Save to Sheets', config: {}, reason: 'Store the message' },
        );
      } else if (lastType === 'trigger_schedule') {
        recommendations.push(
          { type: 'action_telegram', name: 'Send Telegram', config: {}, reason: 'Send a reminder' },
          { type: 'action_gmail', name: 'Send Email', config: {}, reason: 'Send daily summary' },
          { type: 'action_calendar', name: 'Create Event', config: {}, reason: 'Schedule something' },
        );
      } else if (lastType === 'trigger_sheets') {
        recommendations.push(
          { type: 'action_telegram', name: 'Send Telegram', config: {}, reason: 'Notify about new data' },
          { type: 'action_agent', name: 'AI Agent', config: {}, reason: 'Process the data' },
        );
      }
    } else if (lastType.startsWith('action_')) {
      if (lastType === 'action_agent') {
        recommendations.push(
          { type: 'action_telegram', name: 'Send Telegram', config: {}, reason: 'Share AI result' },
          { type: 'action_gmail', name: 'Send Email', config: {}, reason: 'Email the output' },
          { type: 'action_sheets', name: 'Save to Sheets', config: {}, reason: 'Store result' },
        );
      } else if (lastType === 'action_telegram') {
        recommendations.push(
          { type: 'action_agent', name: 'AI Agent', config: {}, reason: 'Process before sending' },
        );
      }
    }

    return recommendations.map(r => ({ type: r.type, name: r.name, config: r.config }));
  };

  const handleGoalSelect = (goal: UserGoal) => {
    setSelectedGoal(goal);
    setSuggestedNodes(goal.recommendedNodes);
    setStep('customize');
  };

  const handleAddRecommendedNode = (node: { type: NodeType; name: string; config: Record<string, any> }) => {
    setSuggestedNodes(prev => [...prev, node]);
  };

  const handleRemoveSuggestedNode = (index: number) => {
    setSuggestedNodes(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (selectedGoal) {
      onComplete(suggestedNodes);
    } else if (existingNodes.length > 0) {
      suggestedNodes.forEach(node => onAddNode(node.type, node.name));
    }
    onClose();
    setStep('goals');
    setSelectedGoal(null);
    setSuggestedNodes([]);
  };

  const recommendations = getRecommendations();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-4 md:inset-10 bg-slate-900 border border-slate-700/50 rounded-3xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex-none p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Smart Builder</h2>
                  <p className="text-xs text-slate-400">{getTranslation(lang, 'wizard_subtitle')}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex-none px-6 py-3 flex items-center gap-2">
              {['goals', 'customize', 'complete'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s ? 'bg-primary text-white' : 
                    (step === 'complete' || (step === 'customize' && s === 'goals') ? 'bg-primary/50 text-white' : 'bg-slate-700 text-slate-400')
                  }`}>
                    {i + 1}
                  </div>
                  {i < 2 && <ChevronRight className="w-4 h-4 text-slate-600 mx-1" />}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 'goals' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="text-xl font-semibold text-white mb-2">{getTranslation(lang, 'wizard_what_do_you_want')}</h3>
                  <p className="text-sm text-slate-400 mb-6">{getTranslation(lang, 'wizard_choose_goal')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {USER_GOALS.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => handleGoalSelect(goal)}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/30 hover:border-primary/50 hover:bg-slate-800 transition-all text-left group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <goal.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white">{getTranslation(lang, goal.titleKey as any)}</h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{getTranslation(lang, goal.descriptionKey as any)}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>

                  {/* Build Custom Option */}
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSuggestedNodes([]);
                        setStep('customize');
                      }}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-primary/50 text-slate-400 hover:text-white transition-all"
                    >
                      <span className="font-medium">{getTranslation(lang, 'wizard_build_custom')}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'customize' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {selectedGoal ? getTranslation(lang, 'wizard_customize') : getTranslation(lang, 'wizard_add_more')}
                    </h3>
                    {suggestedNodes.length > 0 && (
                      <button
                        onClick={handleComplete}
                        className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-white font-medium text-sm"
                      >
                        <Check className="w-4 h-4" />
                        {getTranslation(lang, 'wizard_done')}
                      </button>
                    )}
                  </div>

                  {/* Current Flow */}
                  {suggestedNodes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-slate-400 mb-3">{getTranslation(lang, 'wizard_your_flow')}</p>
                      <div className="space-y-2">
                        {suggestedNodes.map((node, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/30"
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                              {i + 1}
                            </div>
                            <span className="flex-1 text-white font-medium">{node.name}</span>
                            <button
                              onClick={() => handleRemoveSuggestedNode(i)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                      {suggestedNodes.length === 0 ? getTranslation(lang, 'wizard_recommended') : getTranslation(lang, 'wizard_add_next')}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {recommendations.map((rec, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddRecommendedNode(rec)}
                          disabled={suggestedNodes.some(s => s.type === rec.type)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-primary/40 hover:bg-slate-800/60 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm">{rec.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {getTranslation(lang, 'wizard_recommended')}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                        </button>
                      ))}
                    </div>

                    {/* All Nodes */}
                    <div className="mt-6 pt-6 border-t border-slate-800">
                      <p className="text-sm text-slate-400 mb-3">{getTranslation(lang, 'wizard_all_nodes')}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {POPULAR_NODES.map((node) => (
                          <button
                            key={node.type}
                            onClick={() => handleAddRecommendedNode({ type: node.type, name: getTranslation(lang, node.nameKey as any), config: {} })}
                            className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/40 transition-all text-left"
                          >
                            <node.icon className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-300 truncate">{getTranslation(lang, node.nameKey as any)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
