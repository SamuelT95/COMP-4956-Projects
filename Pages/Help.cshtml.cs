using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace COMP_4956_Projects.Pages;

public class HelpModel : PageModel
{
    private readonly ILogger<HelpModel> _logger;

    public HelpModel(ILogger<HelpModel> logger)
    {
        _logger = logger;
    }

    public void OnGet()
    {
    }
}
