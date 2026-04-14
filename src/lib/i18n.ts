export const translations = {
  en: {
    add_node: "Add Automation Node",
    no_nodes: "No nodes yet",
    tap_plus: "Tap the + button below to start building your automated flow.",
    trigger_schedule: "Schedule Trigger",
    trigger_telegram: "Telegram Trigger",
    trigger_sheets: "Google Sheets Trigger",
    action_sheets: "Google Sheets Action",
    action_calendar: "Google Calendar",
    action_gmail: "Gmail",
    action_telegram: "Telegram Bot Action",
    action_agent: "AI Agent",
    action_condition: "Condition (Filter)",
    start_flow: "Start your flow",
    perform_action: "Perform an action",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    logs: "Execution Logs",
    simulation: "Simulation",
    app_title: "Auto Flow",
    run: "Run",
    stop: "Stop",
    flows: "Flows",
    settings: "Settings",
    configurations: "Configurations",
    history: "History"
  },
  my: {
    add_node: "အလိုအလျောက်လုပ်ဆောင်ချက်အသစ်ထည့်မည်",
    no_nodes: "လုပ်ဆောင်ချက်များ မရှိသေးပါ",
    tap_plus: "အောက်က + ခလုတ်ကိုနှိပ်ပြီး အလိုအလျောက်လုပ်ဆောင်ချက်များကို စတင်တည်ဆောက်ပါ။",
    trigger_schedule: "အချိန်သတ်မှတ်ချက်ဖြင့် စတင်မည်",
    trigger_telegram: "Telegram မှတစ်ဆင့် စတင်မည်",
    trigger_sheets: "Google Sheets မှတစ်ဆင့် စတင်မည်",
    action_sheets: "Google Sheets တွင် လုပ်ဆောင်မည်",
    action_calendar: "Google Calendar",
    action_gmail: "Gmail",
    action_telegram: "Telegram သို့ ပို့မည်",
    action_agent: "AI အကူအညီ",
    action_condition: "စစ်ဆေးချက် (Condition)",
    start_flow: "လုပ်ဆောင်ချက် စတင်ရန်",
    perform_action: "လုပ်ဆောင်ချက် လုပ်ရန်",
    save: "သိမ်းမည်",
    cancel: "မလုပ်တော့ပါ",
    delete: "ဖျက်မည်",
    edit: "ပြင်မည်",
    logs: "မှတ်တမ်း",
    simulation: "စမ်းသပ်ကြည့်ရန်",
    app_title: "အလိုအလျောက် အလုပ်အဖွဲ့",
    run: "စတင်ရန်",
    stop: "ရပ်ရန်",
    flows: "လုပ်ငန်းစဉ်များ",
    settings: "ဆက်တင်များ",
    configurations: "စီမံချက်များ",
    history: "မှတ်တမ်း"
  }
};

export type Language = 'en' | 'my';

export function getTranslation(lang: Language, key: keyof typeof translations['en']) {
  return translations[lang][key] || translations['en'][key];
}
