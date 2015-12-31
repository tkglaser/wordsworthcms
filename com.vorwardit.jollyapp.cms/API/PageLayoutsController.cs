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
    [RoutePrefix("/api/layouts")]
    public class PageLayoutsController : ApiController
    {
        public ApplicationDbContext db = new ApplicationDbContext();

        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {
            return await Get(false);
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(bool noBody)
        {
            if (noBody)
            {
                return Ok(from l in db.PageLayouts
                          orderby l.Name
                          select new
                          {
                              l.PageLayoutId,
                              l.LayoutId,
                              l.Name
                          });
            }
            else
            {
                return Ok(await db.PageLayouts.OrderBy(l => l.Name).ToListAsync());
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageLayout model)
        {
            PageLayout pageLayout;
            if (model.PageLayoutId == Guid.Empty)
            {
                pageLayout = new PageLayout();
                pageLayout.PageLayoutId = Guid.NewGuid();
                db.PageLayouts.Add(pageLayout);
            }
            else
            {
                pageLayout = await db.PageLayouts.FindAsync(model.PageLayoutId);
            }
            pageLayout.LayoutId = model.LayoutId;
            pageLayout.Name = model.Name;
            pageLayout.Body = model.Body;
            await db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(Guid id)
        {
            var pageLayout = await db.PageLayouts.FindAsync(id);
            if (pageLayout != null)
            {
                db.PageLayouts.Remove(pageLayout);
                await db.SaveChangesAsync();
            }
            return Ok();
        }
    }
}
