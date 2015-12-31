using com.vorwardit.jollyapp.cms.Engine;
using com.vorwardit.jollyapp.cms.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.jollyapp.cms.API
{
    [RoutePrefix("/api/pageversions")]
    public class PageVersionsController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid pageId)
        {
            var pages = await (from pv in db.PageVersions.AsNoTracking()
                               where pv.PageId == pageId
                               orderby pv.RevisionNumber descending
                               select pv).ToListAsync();

            return Ok(pages);
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageVersion model)
        {
            Page page;
            page = await db.Pages.FindAsync(model.PageId);
            var version = (from pv in page.Versions
                           orderby pv.RevisionNumber descending
                           select pv).FirstOrDefault();

            if (version == null)
            {
                version = new PageVersion
                {
                    PageVersionId = Guid.NewGuid(),
                    PageId = model.PageId,
                    RevisionNumber = 1,
                    Status = PageVersionStatus.Draft
                };
                db.PageVersions.Add(version);
            }
            else if (version.Status == PageVersionStatus.Published)
            {
                var newVersion = new PageVersion
                {
                    PageVersionId = Guid.NewGuid(),
                    PageId = model.PageId,
                    RevisionNumber = version.RevisionNumber + 1,
                    Status = PageVersionStatus.Draft                   
                };
                version = newVersion;
                db.PageVersions.Add(version);
            }

            version.Body = model.Body;
            version.MetaDescription = model.MetaDescription;
            version.Title = model.Title;

            await db.SaveChangesAsync();
            DbPathProviderSingleton.Instance.InvalidateCache();
            return Ok();
        }
    }
}
