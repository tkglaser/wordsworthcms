namespace com.vorwardit.wordsworthcms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigFkSite : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Permissions", "SiteId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Permissions", "SiteId", c => c.Long());
        }
    }
}
