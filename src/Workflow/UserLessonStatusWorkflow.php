<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Workflow;

use Lyrasoft\Melo\Enum\UserLessonStatus;
use Unicorn\Attributes\StateMachine;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\WorkflowController;

#[StateMachine(
    field: 'status',
    enum: UserLessonStatus::class,
    strict: false
)]
class UserLessonStatusWorkflow extends AbstractWorkflow
{
    public function configure(WorkflowController $workflow): void
    {
        $workflow->setStateMeta(
            UserLessonStatus::PROCESS,
            UserLessonStatus::PROCESS->getTitle($this->lang),
            '',
            'primary'
        );

        $workflow->setStateMeta(
            UserLessonStatus::PASSED,
            UserLessonStatus::PASSED->getTitle($this->lang),
            '',
            'success'
        );

        $workflow->setStateMeta(
            UserLessonStatus::FAILED,
            UserLessonStatus::FAILED->getTitle($this->lang),
            '',
            'danger'
        );

        $workflow->setInitialStates(
            [
                UserLessonStatus::PROCESS,
            ]
        );

        $workflow->addTransition(
            'pass',
            [
                UserLessonStatus::PROCESS,
            ],
            UserLessonStatus::PASSED,
        )
            ->button('fa fa-fw fa-check text-success', $this->lang->trans('melo.user.segment.status.done'));

        $workflow->addTransition(
            'fail',
            [
                UserLessonStatus::PROCESS,
            ],
            UserLessonStatus::FAILED,
        )
            ->button('fa fa-fw fa-xmark text-danger', $this->lang->trans('melo.user.segment.status.pending'));
    }
}
