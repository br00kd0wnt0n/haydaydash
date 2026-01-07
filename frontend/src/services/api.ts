import { DashboardState, AIAssessment } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function getAIAssessment(state: DashboardState): Promise<AIAssessment> {
  const response = await fetch(`${API_BASE}/ai/assessment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI assessment');
  }

  return response.json();
}

export async function savePreset(name: string, config: DashboardState): Promise<void> {
  const response = await fetch(`${API_BASE}/presets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, config }),
  });

  if (!response.ok) {
    throw new Error('Failed to save preset');
  }
}

export async function loadPresets(): Promise<{ id: string; name: string; config: DashboardState }[]> {
  const response = await fetch(`${API_BASE}/presets`);

  if (!response.ok) {
    throw new Error('Failed to load presets');
  }

  return response.json();
}

export async function generateShareUrl(state: DashboardState): Promise<string> {
  // Encode state in URL params
  const params = new URLSearchParams();
  params.set('s', state.strategy);
  params.set('b', state.budget.toString());
  params.set('t', state.timing);
  params.set('ch', JSON.stringify(state.channels));
  params.set('rg', JSON.stringify(state.regions));

  return `${window.location.origin}?${params.toString()}`;
}

export function parseShareUrl(): Partial<DashboardState> | null {
  const params = new URLSearchParams(window.location.search);

  if (!params.has('s')) {
    return null;
  }

  try {
    const state: Partial<DashboardState> = {};

    if (params.has('s')) {
      state.strategy = params.get('s') as DashboardState['strategy'];
    }
    if (params.has('b')) {
      state.budget = parseInt(params.get('b')!);
    }
    if (params.has('t')) {
      state.timing = params.get('t') as DashboardState['timing'];
    }
    if (params.has('ch')) {
      state.channels = JSON.parse(params.get('ch')!);
    }
    if (params.has('rg')) {
      state.regions = JSON.parse(params.get('rg')!);
    }

    return state;
  } catch {
    return null;
  }
}
