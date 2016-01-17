using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace com.vorwardit.wordsworthcms.API
{
    [Authorize]
    [RoutePrefix("api/content")]
    public class ContentController : ApiController
    {
        IContentService contentService;

        public ContentController(IContentService contentService)
        {
            this.contentService = contentService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> GetBySiteId(Guid siteId)
        {
            var contents = await contentService.GetBySiteIdAsync(siteId);
            return Ok(from c in contents
                      select new
                      {
                          c.ContentId,
                          c.SiteId,
                          c.Url
                      });
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(long id)
        {
            return Ok(await contentService.GetAsync(id));
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(Content model)
        {
            Content content = await contentService.GetOrCreateAsync(model.ContentId);
            content.Body = model.Body;
            content.SiteId = model.SiteId;
            content.Url = model.Url;
            await contentService.UpdateAsync(content);
            return Ok();
        }

        [HttpDelete]
        public async Task<IHttpActionResult> Delete(long id)
        {
            await contentService.DeleteAsync(id);
            return Ok();
        }
    }
}
