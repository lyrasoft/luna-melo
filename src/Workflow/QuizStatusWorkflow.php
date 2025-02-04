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
    strict: true
)]
class QuizStatusWorkflow extends AbstractWorkflow
{
    public function configure(WorkflowController $workflow): void
    {
        $workflow->setStateMeta(
            UserSegmentStatus::PROCESS,
            UserSegmentStatus::PROCESS->getTitle($this->lang),
            '',
            'primary'
        );

        $workflow->setStateMeta(
            UserSegmentStatus::PASSED,
            UserSegmentStatus::PASSED->getTitle($this->lang),
            '',
            'success'
        );

        $workflow->setStateMeta(
            UserSegmentStatus::FAILED,
            UserSegmentStatus::FAILED->getTitle($this->lang),
            '',
            'danger'
        );

        $workflow->setInitialStates(
            [
                UserSegmentStatus::PROCESS,
            ]
        );

        $workflow->addTransition(
            'passed',
            UserSegmentStatus::PROCESS,
            UserSegmentStatus::PASSED,
        )
            ->button('fa fa-fw fa-check text-success', $this->lang->trans('melo.user.segment.status.passed'));

        $workflow->addTransition(
            'failed',
            UserSegmentStatus::PROCESS,
            UserSegmentStatus::FAILED,
        )
            ->button('fa fa-fw fa-xmark text-danger', $this->lang->trans('melo.user.segment.status.failed'));
    }
}
