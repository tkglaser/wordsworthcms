namespace com.vorwardit.wordsworthcms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigLayoutSiteId : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Pages", "SiteId", "dbo.Sites");
            DropIndex("dbo.Pages", new[] { "SiteId" });
            AddColumn("dbo.Layouts", "SiteId", c => c.Guid(nullable: false));
            CreateIndex("dbo.Layouts", "SiteId");
            AddForeignKey("dbo.Layouts", "SiteId", "dbo.Sites", "SiteId", cascadeDelete: true);
            DropColumn("dbo.Pages", "SiteId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Pages", "SiteId", c => c.Guid(nullable: false));
            DropForeignKey("dbo.Layouts", "SiteId", "dbo.Sites");
            DropIndex("dbo.Layouts", new[] { "SiteId" });
            DropColumn("dbo.Layouts", "SiteId");
            CreateIndex("dbo.Pages", "SiteId");
            AddForeignKey("dbo.Pages", "SiteId", "dbo.Sites", "SiteId", cascadeDelete: true);
        }
    }
}
