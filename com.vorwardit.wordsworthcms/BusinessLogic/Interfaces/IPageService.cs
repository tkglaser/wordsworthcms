using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Interfaces
{
    public interface IPageService
    {
        PageVersion GetPageVersion(Guid id);
        Task<PageVersion> GetPageVersionAsync(Guid id);
        Task<IList<PageVersion>> GetPageVersionsByPageIdAsync(Guid pageId);
        Task<PageVersion> GetLatestPublishedVersionAsync(Guid siteId, string path);
        Task<PageVersion> GetErrorPageAsync(Guid siteId, int errorCode);
        Task<Page> GetAsync(Guid id);
        Task<Page> GetOrCreateAsync(Guid id);
        Task<IList<Page>> GetBySiteIdAsync(Guid siteId);
        Task CreateNewVersionAsync(Guid pageId);

        Task Publish(Guid pageVersionId);

        Task UpdateAsync(Guid pageId, Guid pageLayoutId, string name, string[] urls);
        Task UpdateAsync(PageVersion pv);
        Task UpdateLatestVersionAsync(PageVersion pv);

        Task DeleteAsync(Guid id);
    }
}
