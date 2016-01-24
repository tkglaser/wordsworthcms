namespace com.vorwardit.wordsworthcms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigFkSite2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Permissions", "SiteId", c => c.Guid());
            CreateIndex("dbo.Permissions", "SiteId");
            AddForeignKey("dbo.Permissions", "SiteId", "dbo.Sites", "SiteId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Permissions", "SiteId", "dbo.Sites");
            DropIndex("dbo.Permissions", new[] { "SiteId" });
            DropColumn("dbo.Permissions", "SiteId");
        }
    }
}
