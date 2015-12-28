namespace com.vorwardit.jollyapp.cms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class VersionsData : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PageVersions", "Body", c => c.String());
            AlterColumn("dbo.PageVersions", "Title", c => c.String(maxLength: 1024));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.PageVersions", "Title", c => c.String());
            DropColumn("dbo.PageVersions", "Body");
        }
    }
}
