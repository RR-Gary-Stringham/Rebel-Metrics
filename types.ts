/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type VisualizationType = 'bar' | 'line' | 'pie' | 'velocity' | 'progress' | 'metric-only';

export interface Action {
  label: string;
  onClick?: () => void;
}

export interface AppState {
  currentDashboard: DashboardCard[];
  isGenerating: boolean;
  prompt: string;
}


export interface Artifact {
  id: string;
  styleName: string;
  html: string;
  status: 'streaming' | 'complete' | 'error';
}


export interface DashboardCard {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'insights' | 'engagement';
  title: string;
  subtitle?: string;
  data: any;
  visualization?: VisualizationType;
  actions?: string[];
  footer?: string;
  width?: 'full' | 'half' | 'third';
  codeSnippet?: string;
  developerNotes?: string;
}

export interface MetricData {
  value: string | number;
  trend?: {
    value: number;
    label: string;
    isUp: boolean;
  };
}


export interface Session {
    id: string;
    prompt: string;
    timestamp: number;
    artifacts: Artifact[];
}

export interface ComponentVariation { name: string; html: string; }
export interface LayoutOption { name: string; css: string; previewHtml: string; }

