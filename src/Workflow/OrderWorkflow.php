<?php

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
        //
    }
}
