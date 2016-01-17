using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using com.vorwardit.wordsworthcms.Models;
using System.Threading.Tasks;
using System.Data.Entity;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Services
{
    public class ContentService : IContentService
    {
        private ApplicationDbContext db;

        public ContentService(ApplicationDbContext db)
        {
            this.db = db;
        }

        public async Task<Content> GetAsync(long id)
        {
            return await db.Contents.SingleAsync(l => l.ContentId == id);
        }

        public async Task<Content> GetAsync(Guid siteId, string path)
        {
            if (path == null)
            {
                path = string.Empty;
            }
            if (!path.StartsWith("/"))
            {
                path = "/" + path;
            }

            return await (from c in db.Contents
                          where c.Url == path
                          where c.SiteId == siteId
                          select c).FirstOrDefaultAsync();
        }

        public async Task<Content> GetOrCreateAsync(long id)
        {
            var content = await db.Contents.FirstOrDefaultAsync(l => l.ContentId == id);
            if (content == null)
            {
                content = new Content();
                content.ContentId = -1;
            }
            return content;
        }

        public async Task<IList<Content>> GetBySiteIdAsync(Guid siteId)
        {
            return await (from l in db.Contents
                          where l.SiteId == siteId
                          select l).ToListAsync();
        }

        public async Task UpdateAsync(Content content)
        {
            if (content.ContentId == -1)
            {
                db.Contents.Add(content);
            }
            await db.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var content = await db.Contents.FindAsync(id);
            if (content != null)
            {
                db.Contents.Remove(content);
                await db.SaveChangesAsync();
            }
        }
    }
}