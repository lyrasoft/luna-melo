<?php

/**
 * Part of melo project.
 *
 * @copyright  Copyright (C) 2023 __ORGANIZATION__.
 * @license    __LICENSE__
 */

declare(strict_types=1);

namespace Lyrasoft\Melo\Workflow;

use Lyrasoft\Melo\Enum\OrderState;
use Unicorn\Attributes\StateMachine;
use Unicorn\Workflow\AbstractWorkflow;
use Unicorn\Workflow\WorkflowController;

/**
 * The OrderWorkflow class.
 */
#[StateMachine(
    field: 'state',
    enum: OrderState::class
)]
class OrderWorkflow extends AbstractWorkflow
{
    public function configure(WorkflowController $workflow): void
    {
        $workflow->setStateMeta(
            OrderState::PENDING,
            OrderState::PENDING->trans($this->lang),
            '',
            'warning'
        );
        $workflow->setStateMeta(
            OrderState::FREE,
            OrderState::FREE->trans($this->lang),
            '',
            'primary'
        );
        $workflow->setStateMeta(
            OrderState::PAID,
            OrderState::PAID->trans($this->lang),
            '',
            'success'
        );
        $workflow->setStateMeta(
            OrderState::FAILED,
            OrderState::FAILED->trans($this->lang),
            '',
            'danger'
        );
        $workflow->setStateMeta(
            OrderState::CANCELLED,
            OrderState::CANCELLED->trans($this->lang),
            '',
            'secondary'
        );
    }
}
