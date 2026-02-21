<?php

declare(strict_types=1);

namespace Lyrasoft\Melo\Entity;

use Windwalker\ORM\Attributes\AutoIncrement;
use Windwalker\ORM\Attributes\Cast;
use Windwalker\ORM\Cast\JsonCast;
use Windwalker\Core\DateTime\Chronos;
use Windwalker\ORM\Attributes\CastNullable;
use Windwalker\Core\DateTime\ServerTimeCast;
use Windwalker\ORM\Attributes\CreatedTime;
use Windwalker\ORM\Attributes\Column;
use Windwalker\ORM\Attributes\EntitySetup;
use Windwalker\ORM\Attributes\PK;
use Windwalker\ORM\Attributes\Table;
use Windwalker\ORM\EntityInterface;
use Windwalker\ORM\EntityTrait;
use Windwalker\ORM\Metadata\EntityMetadata;

use function Windwalker\unwrap_enum;

// phpcs:disable
// todo: remove this when phpcs supports 8.4
#[Table('user_answers', 'user_answer')]
#[\AllowDynamicProperties]
class UserAnswer implements EntityInterface
{
    use EntityTrait;

    #[Column('id'), PK, AutoIncrement]
    public ?int $id = null;

    #[Column('user_id')]
    public int $userId = 0;

    #[Column('lesson_id')]
    public int $lessonId = 0;

    #[Column('quiz_id')]
    public int $quizId = 0;

    #[Column('question_id')]
    public int $questionId = 0;

    #[Column('question_type')]
    public string $questionType = '' {
        set(string|\BackedEnum $value) => $this->questionType = unwrap_enum($value);
    }

    #[Column('score')]
    public float $score = 0;

    #[Column('value')]
    #[Cast(JsonCast::class)]
    public array $value = [];

    #[Column('is_correct')]
    #[Cast('bool', 'int')]
    public bool $isCorrect = false;

    #[Column('created')]
    #[CastNullable(ServerTimeCast::class)]
    #[CreatedTime]
    public ?Chronos $created = null {
        set(\DateTimeInterface|string|null $value) => $this->created = Chronos::tryWrap($value);
    }

    #[EntitySetup]
    public static function setup(EntityMetadata $metadata): void
    {
        //
    }
}
