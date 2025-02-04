<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Workflow;

use Lyrasoft\Melo\Enum\UserSegmentStatus;
use Unicorn\Attributes\StateMachine;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\WorkflowController;

#[StateMachine(
    field: 'status',
    enum: UserSegmentStatus::class,
    strict: false
)]
class HomeworkStatusWorkflow extends AbstractWorkflow
{
    public function configure(WorkflowController $workflow): void
    {
        $workflow->setStateMeta(
            UserSegmentStatus::PENDING,
            UserSegmentStatus::PENDING->trans($this->lang),
            '',
            'primary'
        );

        $workflow->setStateMeta(
            UserSegmentStatus::DONE,
            UserSegmentStatus::DONE->trans($this->lang),
            '',
            'success'
        );

        $workflow->setInitialStates(
            [
                UserSegmentStatus::PENDING,
            ]
        );

        $workflow->addTransition(
            'done',
            [
                UserSegmentStatus::PENDING,
            ],
            UserSegmentStatus::DONE,
        )
            ->button('fa fa-fw fa-check text-success', $this->lang->trans('melo.user.segment.status.done'));

        $workflow->addTransition(
            'undone',
            [
                UserSegmentStatus::DONE,
            ],
            UserSegmentStatus::PENDING,
        )
            ->button('fa fa-fw fa-xmark text-danger', $this->lang->trans('melo.user.segment.status.pending'));
    }
}
