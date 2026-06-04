import jsPDF from 'jspdf'

export function generateTailoredCVPdf(cvData, tailored, jobTitle, company) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 20
  const pageW = 210
  const contentW = pageW - margin * 2
  let y = margin

  const addText = (text, size, bold, color = [26, 17, 8]) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, contentW)
    lines.forEach(line => {
      if (y > 270) { doc.addPage(); y = margin }
      doc.text(line, margin, y)
      y += size * 0.45
    })
  }

  const addDivider = (color = [220, 210, 200]) => {
    doc.setDrawColor(...color)
    doc.setLineWidth(0.4)
    doc.line(margin, y, pageW - margin, y)
    y += 5
  }

  addText(cvData.full_name, 22, true, [255, 77, 0])
  y += 2
  addText(`${cvData.email}  |  ${cvData.phone || ''}  |  ${cvData.linkedin || ''}`, 9, false, [100, 90, 80])
  y += 4
  addDivider()

  addText(`Tailored for: ${jobTitle} at ${company}`, 9, false, [124, 58, 237])
  y += 4

  addText('PROFESSIONAL SUMMARY', 10, true, [255, 77, 0])
  y += 2
  addText(tailored.tailored_summary, 10, false)
  y += 5

  addDivider()
  addText('HIGHLIGHTED SKILLS', 10, true, [255, 77, 0])
  y += 2
  addText(tailored.highlighted_skills.join('  ·  '), 10, false)
  y += 5

  addDivider()
  addText('EDUCATION', 10, true, [255, 77, 0])
  y += 2
  cvData.education?.forEach(edu => {
    addText(`${edu.degree} — ${edu.institution} (${edu.graduation_year})`, 10, true)
    if (edu.relevant_courses?.length) {
      addText(`Relevant: ${edu.relevant_courses.join(', ')}`, 9, false, [100, 90, 80])
    }
    y += 2
  })

  if (tailored.tailored_experience?.length) {
    addDivider()
    addText('EXPERIENCE', 10, true, [255, 77, 0])
    y += 2
    tailored.tailored_experience.forEach(exp => {
      addText(`${exp.title} — ${exp.company}  (${exp.duration})`, 10, true)
      exp.description?.forEach(bullet => {
        addText(`• ${bullet}`, 9.5, false)
      })
      y += 3
    })
  }

  if (tailored.tailored_projects?.length) {
    addDivider()
    addText('PROJECTS', 10, true, [255, 77, 0])
    y += 2
    tailored.tailored_projects.forEach(proj => {
      addText(`${proj.name}`, 10, true)
      addText(proj.description, 9.5, false)
      addText(`Tech: ${proj.technologies?.join(', ')}`, 9, false, [100, 90, 80])
      y += 3
    })
  }

  doc.save(`CV_${cvData.full_name.replace(/\s/g, '_')}_${company.replace(/\s/g, '_')}.pdf`)
}
