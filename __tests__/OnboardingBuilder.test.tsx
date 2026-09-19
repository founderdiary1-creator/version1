import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OnboardingBuilderPage from '@/app/admin/onboarding-builder/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks to avoid actual API calls
vi.mock('@/hooks/useOnboardingBuilder', () => ({
  useFormSectionsQuery: () => ({ data: [], isLoading: false }),
  useCreateSectionMutation: () => ({ mutateAsync: vi.fn() }),
  useUpdateSectionMutation: () => ({ mutateAsync: vi.fn() }),
  useDeleteSectionMutation: () => ({ mutateAsync: vi.fn() }),
  useCreateQuestionMutation: () => ({ mutateAsync: vi.fn() }),
  useUpdateQuestionMutation: () => ({ mutateAsync: vi.fn() }),
  useDeleteQuestionMutation: () => ({ mutateAsync: vi.fn() }),
  useReorderMutation: () => ({ mutateAsync: vi.fn() }),
}));

// Mock drag and drop context to avoid window errors
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => <div>{children}</div>,
  Droppable: ({ children }: any) => children({ droppableProps: {}, innerRef: vi.fn(), placeholder: null }),
  Draggable: ({ children }: any) => children({ draggableProps: {}, dragHandleProps: {}, innerRef: vi.fn() }),
}));

describe('OnboardingBuilderPage', () => {
  it('renders the header correctly', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <OnboardingBuilderPage />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('Onboarding Builder')).toBeInTheDocument();
    expect(screen.getByText('New Section')).toBeInTheDocument();
    expect(screen.getByText('Preview Live Form')).toBeInTheDocument();
  });
});
