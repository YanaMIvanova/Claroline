<?php

namespace Claroline\AgendaBundle\Serializer;

use Claroline\AgendaBundle\Entity\Event;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class EventSerializer
{
    use SerializerTrait;

    /** @var AuthorizationCheckerInterface */
    private $authorization;

    /** @var ObjectManager */
    private $om;

    /** @var PublicFileSerializer */
    private $fileSerializer;

    /** @var WorkspaceSerializer */
    private $workspaceSerializer;

    /** @var UserSerializer */
    private $userSerializer;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        ObjectManager $om,
        PublicFileSerializer $fileSerializer,
        WorkspaceSerializer $workspaceSerializer,
        UserSerializer $userSerializer
    ) {
        $this->authorization = $authorization;
        $this->om = $om;
        $this->fileSerializer = $fileSerializer;
        $this->workspaceSerializer = $workspaceSerializer;
        $this->userSerializer = $userSerializer;
    }

    public function getName()
    {
        return 'event';
    }

    public function serialize(Event $event): array
    {
        return [
            'id' => $event->getUuid(),
            'title' => $event->getName(),
            'start' => $event->getStart() ? DateNormalizer::normalize($event->getStart()) : null,
            'end' => $event->getEnd() ? DateNormalizer::normalize($event->getEnd()) : null,
            'thumbnail' => $this->serializeThumbnail($event),
            'description' => $event->getDescription(),
            'workspace' => $event->getWorkspace() ? $this->workspaceSerializer->serialize($event->getWorkspace(), [Options::SERIALIZE_MINIMAL]) : null,
            'meta' => [
                'type' => $event->getType(),
                'creator' => $this->userSerializer->serialize($event->getCreator(), [Options::SERIALIZE_MINIMAL]),
            ],
            'display' => [
                'color' => $event->getColor(),
            ],
            'permissions' => [
                'edit' => $this->authorization->isGranted('EDIT', $event),
                'delete' => $this->authorization->isGranted('DELETE', $event),
            ],
        ];
    }

    /**
     * Serialize the event thumbnail.
     */
    private function serializeThumbnail(Event $event): ?array
    {
        if (!empty($event->getThumbnail())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository(PublicFile::class)
                ->findOneBy(['url' => $event->getThumbnail()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }

    public function deserialize(array $data, Event $event = null): Event
    {
        $this->sipe('id', 'setUuid', $data, $event);
        $this->sipe('title', 'setName', $data, $event);
        $this->sipe('display.color', 'setColor', $data, $event);
        $this->sipe('description', 'setDescription', $data, $event);

        if (isset($data['meta'])) {
            $this->sipe('meta.type', 'setType', $data, $event);

            if (isset($data['meta']['creator'])) {
                /** @var User $creator */
                $creator = $this->om->getObject($data['meta']['creator'], User::class);
                $event->setCreator($creator);
            }
        }

        if (isset($data['thumbnail']) && isset($data['thumbnail']['url'])) {
            $event->setThumbnail($data['thumbnail']['url']);
        }

        if (isset($data['workspace'])) {
            /** @var Workspace $workspace */
            $workspace = $this->om->getObject($data['workspace'], Workspace::class);
            if ($workspace->getId()) {
                $event->setWorkspace($workspace);
            }
        }

        if (isset($data['start'])) {
            $event->setStart(DateNormalizer::denormalize($data['start']));
        }

        if (isset($data['end'])) {
            $event->setEnd(DateNormalizer::denormalize($data['end']));
        }

        return $event;
    }
}
