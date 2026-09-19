'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Edit2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { FormSectionWithQuestions, FormQuestion } from '@/types/onboarding';
import { useReorderMutation, useDeleteSectionMutation, useDeleteQuestionMutation } from '@/hooks/useOnboardingBuilder';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface SectionListProps {
  sections: FormSectionWithQuestions[];
  filterArchetype: string;
  onEditQuestion: (sectionId: string, question: FormQuestion | null) => void;
}

export default function SectionList({ sections, filterArchetype, onEditQuestion }: SectionListProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  // State for confirm modals
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  const reorderMutation = useReorderMutation();
  const deleteSectionMutation = useDeleteSectionMutation();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  const toggleSection = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    if (type === 'section') {
      const items = Array.from(sections);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      
      const payload = items.map((item, index) => ({ id: item.id, order_index: index }));
      await reorderMutation.mutateAsync({ type: 'sections', items: payload });
    } else if (type === 'question') {
      const sectionId = source.droppableId;
      const section = sections.find(s => s.id === sectionId);
      if (!section) return;

      const items = Array.from(section.questions || []);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      const payload = items.map((item, index) => ({ id: item.id, order_index: index }));
      await reorderMutation.mutateAsync({ type: 'questions', items: payload });
    }
  };

  const executeDeleteSection = async () => {
    if (deletingSectionId) {
      await deleteSectionMutation.mutateAsync(deletingSectionId);
      setDeletingSectionId(null);
    }
  };

  const executeDeleteQuestion = async () => {
    if (deletingQuestionId) {
      await deleteQuestionMutation.mutateAsync(deletingQuestionId);
      setDeletingQuestionId(null);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="section">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sections.map((section, index) => {
                const isExpanded = expanded[section.id] ?? true;
                
                // Filter questions
                const visibleQuestions = (section.questions || []).filter(q => 
                  filterArchetype === 'ALL' || (q.target_archetypes && q.target_archetypes.includes(filterArchetype))
                );

                return (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                      >
                        {/* Section Header */}
                        <div 
                          className="px-4 py-4 bg-gray-50 flex items-center justify-between cursor-pointer border-b border-gray-100 group"
                          onClick={() => toggleSection(section.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-700 p-1" onClick={(e) => e.stopPropagation()}>
                              <GripVertical size={20} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{section.title}</h3>
                              {section.description && <p className="text-xs text-gray-500">{section.description}</p>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingSectionId(section.id);
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                            <button 
                              className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:border-[#E31E24] hover:text-[#E31E24] transition-colors flex items-center gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditQuestion(section.id, null); // Add new question
                              }}
                            >
                              <Plus size={14} /> Question
                            </button>
                            <div className="text-gray-400 ml-2">
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>
                        </div>

                        {/* Questions List */}
                        {isExpanded && (
                          <Droppable droppableId={section.id} type="question">
                            {(provided) => (
                              <div 
                                ref={provided.innerRef} 
                                {...provided.droppableProps}
                                className="p-4 space-y-2 min-h-[50px] bg-white"
                              >
                                {visibleQuestions.length === 0 && (
                                  <div className="text-center py-6 text-sm text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                                    No questions found for this section.
                                  </div>
                                )}
                                
                                {visibleQuestions.map((q, qIndex) => (
                                  <Draggable key={q.id} draggableId={q.id} index={qIndex}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-[#E31E24]/30 hover:shadow-sm transition-all group"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-600">
                                            <GripVertical size={16} />
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium text-sm text-gray-900">{q.label}</span>
                                              {q.is_verification_artifact && (
                                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">PROOF</span>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">{q.type.replace('_', ' ')}</span>
                                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                                q.visibility_tier === 'MANDATORY' ? 'bg-red-50 text-red-600' :
                                                q.visibility_tier === 'RECOMMENDED_MEMO' ? 'bg-blue-50 text-blue-600' :
                                                'bg-gray-50 text-gray-500'
                                              }`}>
                                                {q.visibility_tier.replace('_', ' ')}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                            className="p-1.5 text-gray-400 hover:text-[#E31E24] rounded hover:bg-gray-50"
                                            onClick={() => onEditQuestion(section.id, q)}
                                          >
                                            <Edit2 size={16} />
                                          </button>
                                          <button 
                                            className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                                            onClick={() => setDeletingQuestionId(q.id)}
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={!!deletingSectionId}
        title="Delete Section"
        message="Are you sure you want to delete this section? All questions inside it will be permanently deleted. This action cannot be undone."
        confirmText="Delete Section"
        onConfirm={executeDeleteSection}
        onCancel={() => setDeletingSectionId(null)}
      />

      <ConfirmModal
        isOpen={!!deletingQuestionId}
        title="Delete Question"
        message="Are you sure you want to delete this question? Any submitted data related to this question might be orphaned."
        confirmText="Delete Question"
        onConfirm={executeDeleteQuestion}
        onCancel={() => setDeletingQuestionId(null)}
      />
    </>
  );
}
