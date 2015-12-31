namespace com.vorwardit.jollyapp.cms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class MigContent : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Contents",
                c => new
                    {
                        ContentId = c.Long(nullable: false, identity: true),
                        SiteId = c.Guid(nullable: false),
                        Url = c.String(maxLength: 1024),
                        Body = c.String(),
                    })
                .PrimaryKey(t => t.ContentId)
                .ForeignKey("dbo.Sites", t => t.SiteId, cascadeDelete: false)
                .Index(t => t.SiteId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Contents", "SiteId", "dbo.Sites");
            DropIndex("dbo.Contents", new[] { "SiteId" });
            DropTable("dbo.Contents");
        }
    }
}
