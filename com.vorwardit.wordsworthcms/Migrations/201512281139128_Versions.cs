namespace com.vorwardit.wordsworthcms.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Versions : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PageVersions",
                c => new
                    {
                        PageVersionId = c.Guid(nullable: false, defaultValueSql:"newid()"),
                        PageId = c.Guid(nullable: false),
                        Title = c.String(),
                        MetaDescription = c.String(),
                        RevisionNumber = c.Int(nullable: false),
                        Status = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PageVersionId)
                .ForeignKey("dbo.Pages", t => t.PageId, cascadeDelete: false)
                .Index(t => t.PageId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PageVersions", "PageId", "dbo.Pages");
            DropIndex("dbo.PageVersions", new[] { "PageId" });
            DropTable("dbo.PageVersions");
        }
    }
}
