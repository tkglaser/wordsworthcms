using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Engine;
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
    [RoutePrefix("api/pageversions")]
    public class PageVersionsController : ApiController
    {
        IPageService pageService;

        public PageVersionsController(IPageService pageService)
        {
            this.pageService = pageService;
        }

        [HttpGet]
        public async Task<IHttpActionResult> Get(Guid pageId)
        {
            return Ok(await pageService.GetPageVersionsByPageIdAsync(pageId));
        }

        [HttpPost]
        [Route("publish")]
        public async Task<IHttpActionResult> Post(Guid versionId)
        {
            await pageService.Publish(versionId);
            return Ok();
        }

        [HttpPost]
        public async Task<IHttpActionResult> Post(PageVersion model)
        {
            await pageService.UpdateLatestVersionAsync(model);
            return Ok();
        }
    }
}
