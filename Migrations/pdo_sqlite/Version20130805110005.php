<?php

namespace Claroline\RssReaderBundle\Migrations\pdo_sqlite;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2013/08/05 11:00:05
 */
class Version20130805110005 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_rssreader_configuration (
                id INTEGER NOT NULL, 
                workspace_id INTEGER DEFAULT NULL, 
                user_id INTEGER DEFAULT NULL, 
                url VARCHAR(255) NOT NULL, 
                is_default BOOLEAN NOT NULL, 
                is_desktop BOOLEAN NOT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE INDEX IDX_8D6D1C5482D40A1F ON claro_rssreader_configuration (workspace_id)
        ");
        $this->addSql("
            CREATE INDEX IDX_8D6D1C54A76ED395 ON claro_rssreader_configuration (user_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_rssreader_configuration
        ");
    }
}