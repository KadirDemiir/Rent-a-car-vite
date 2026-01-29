<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    public function index()
    {
        $templates = EmailTemplate::orderBy('name')->get();
        $languages = getActiveLanguages();
        return Inertia::render('adminPanel/emailTemplates/EmailTemplates', [
            'templates' => $templates,
            'languages' => $languages
        ]);
    }

    public function show($id)
    {
        $template = EmailTemplate::findOrFail($id);
        $languages = getActiveLanguages();
        return Inertia::render('adminPanel/emailTemplates/EditEmailTemplate', [
            'template' => $template,
            'languages' => $languages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'unique:email_templates,name'],
            'subject' => ['required'],
            'body' => ['required'],
            'variables' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $languages = getActiveLanguages()->pluck('code')->toArray();
        $validated['subject'] = $this->normalizeLocalizedField($request->input('subject'), $languages, 'subject');
        $validated['body'] = $this->normalizeLocalizedField($request->input('body'), $languages, 'body');

        $template = EmailTemplate::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Email template created successfully',
            'template' => $template
        ]);
    }

    public function update(Request $request, $id)
    {
        $template = EmailTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'unique:email_templates,name,' . $id],
            'subject' => ['required'],
            'body' => ['required'],
            'variables' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $languages = getActiveLanguages()->pluck('code')->toArray();
        $validated['subject'] = $this->normalizeLocalizedField($request->input('subject'), $languages, 'subject');
        $validated['body'] = $this->normalizeLocalizedField($request->input('body'), $languages, 'body');

        $template->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Email template updated successfully',
            'template' => $template
        ]);
    }

    public function destroy($id)
    {
        $template = EmailTemplate::findOrFail($id);
        $template->delete();

        return response()->json([
            'success' => true,
            'message' => 'Email template deleted successfully'
        ]);
    }

    public function getAllTemplates()
    {
        return response()->json([
            'templates' => EmailTemplate::where('is_active', true)->get()
        ]);
    }

    private function normalizeLocalizedField($value, array $languages, string $field)
    {
        if (is_array($value)) {
            foreach ($languages as $lang) {
                if (!isset($value[$lang]) || trim($value[$lang]) === '') {
                    abort(422, ucfirst($field) . ' is required for all languages.');
                }
            }
            return json_encode($value, JSON_UNESCAPED_UNICODE);
        }

        if (is_string($value) && trim($value) !== '') {
            return $value;
        }

        abort(422, ucfirst($field) . ' is required.');
    }
}
